
import React, { useEffect, useRef, FC, useMemo, useState } from 'react';
import * as THREE from 'three';
import * as POSTPROCESSING from 'postprocessing';

const { BloomEffect, EffectComposer, EffectPass, RenderPass } = POSTPROCESSING;

interface Distortion {
  uniforms: Record<string, { value: any }>;
  getDistortion: string;
}

interface Distortions {
  [key: string]: Distortion;
}

interface Colors {
  roadColor: number;
  islandColor: number;
  background: number;
  shoulderLines: number;
  brokenLines: number;
  leftCars: number[];
  rightCars: number[];
  sticks: number;
}

interface HyperspeedOptions {
  distortion?: string | Distortion;
  length: number;
  roadWidth: number;
  islandWidth: number;
  lanesPerRoad: number;
  fov: number;
  fovSpeedUp: number;
  speedUp: number;
  colors: Colors;
  shoulderLinesWidthPercentage: number;
  brokenLinesWidthPercentage: number;
  brokenLinesLengthPercentage: number;
}

interface HyperspeedProps {
  effectOptions?: Partial<HyperspeedOptions>;
}

const defaultOptions: HyperspeedOptions = {
  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0x10b981, 0x059669, 0x047857],
    rightCars: [0x3b82f6, 0x2563eb, 0x1d4ed8],
    sticks: 0x10b981
  }
};

const distortions: Distortions = {
  turbulentDistortion: {
    uniforms: {
      uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
      uAmp: { value: new THREE.Vector4(25, 5, 10, 10) }
    },
    getDistortion: `
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      float nsin(float val){
        return sin(val) * 0.5 + 0.5;
      }
      #define PI 3.14159265358979
      float getDistortionX(float progress){
        return (
          cos(PI * progress * uFreq.r + uTime) * uAmp.r +
          pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
        );
      }
      float getDistortionY(float progress){
        return (
          -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
          -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a
        );
      }
      vec3 getDistortion(float progress){
        return vec3(
          getDistortionX(progress) - getDistortionX(0.0125),
          getDistortionY(progress) - getDistortionY(0.0125),
          0.
        );
      }
    `
  }
};

const getRoadVertexShader = (distortionGLSL: string) => `
  #define USE_FOG
  uniform float uTime;
  ${THREE.ShaderChunk['fog_pars_vertex']}
  uniform float uTravelLength;
  varying vec2 vUv; 
  
  ${distortionGLSL}

  void main() {
    vec3 transformed = position.xyz;
    vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
    transformed.x += distortion.x;
    transformed.z += distortion.y;
    transformed.y += -1. * distortion.z;  
    
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    ${THREE.ShaderChunk['fog_vertex']}
  }
`;

const islandFragment = `
  #define USE_FOG
  varying vec2 vUv; 
  uniform vec3 uColor;
  ${THREE.ShaderChunk['fog_pars_fragment']}
  void main() {
    gl_FragColor = vec4(uColor, 1.);
    ${THREE.ShaderChunk['fog_fragment']}
  }
`;

const roadFragment = `
  #define USE_FOG
  varying vec2 vUv; 
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uLanes;
  uniform vec3 uBrokenLinesColor;
  uniform vec3 uShoulderLinesColor;
  uniform float uShoulderLinesWidthPercentage;
  uniform float uBrokenLinesWidthPercentage;
  uniform float uBrokenLinesLengthPercentage;
  ${THREE.ShaderChunk['fog_pars_fragment']}
  void main() {
    vec2 uv = vUv;
    vec3 color = uColor;
    
    uv.y = mod(uv.y + uTime * 0.1, 1.);
    float laneWidth = 1.0 / uLanes;
    float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
    float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;

    float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
    float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);
    
    color = mix(color, uBrokenLinesColor, brokenLines);
    color = mix(color, uShoulderLinesColor, sideLines);

    gl_FragColor = vec4(color, 1.);
    ${THREE.ShaderChunk['fog_fragment']}
  }
`;

class AppEngine {
  container: HTMLElement;
  options: HyperspeedOptions;
  renderer: THREE.WebGLRenderer;
  composer: POSTPROCESSING.EffectComposer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  clock: THREE.Clock;
  disposed: boolean = false;
  uTime: { value: number } = { value: 0 };
  fogUniforms: Record<string, { value: any }>;

  constructor(container: HTMLElement, options: HyperspeedOptions) {
    this.container = container;
    this.options = options;

    const distortion = typeof options.distortion === 'string' 
      ? distortions[options.distortion] || distortions.turbulentDistortion
      : options.distortion || distortions.turbulentDistortion;

    this.renderer = new THREE.WebGLRenderer({ 
      antialias: false, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height);
    
    this.composer = new EffectComposer(this.renderer, {
      multisampling: 0,
      frameBufferType: THREE.HalfFloatType
    });

    this.camera = new THREE.PerspectiveCamera(options.fov, width / height, 0.1, 10000);
    this.camera.position.set(0, 8, -5);
    this.camera.lookAt(0, 0, -50);

    this.scene = new THREE.Scene();
    const fogColor = new THREE.Color(options.colors.background);
    const fog = new THREE.Fog(fogColor, options.length * 0.2, options.length * 5);
    this.scene.fog = fog;
    this.fogUniforms = {
      fogColor: { value: fog.color },
      fogNear: { value: fog.near },
      fogFar: { value: fog.far }
    };

    this.clock = new THREE.Clock();

    const createPlane = (side: number, isRoad: boolean) => {
      const geometry = new THREE.PlaneGeometry(
        isRoad ? options.roadWidth : options.islandWidth,
        options.length,
        20,
        100
      );

      const material = new THREE.ShaderMaterial({
        fragmentShader: isRoad ? roadFragment : islandFragment,
        vertexShader: getRoadVertexShader(distortion.getDistortion),
        side: THREE.DoubleSide,
        uniforms: {
          ...distortion.uniforms,
          ...this.fogUniforms,
          uTravelLength: { value: options.length },
          uColor: { value: new THREE.Color(isRoad ? options.colors.roadColor : options.colors.islandColor) },
          uTime: this.uTime,
          uLanes: { value: options.lanesPerRoad },
          uBrokenLinesColor: { value: new THREE.Color(options.colors.brokenLines) },
          uShoulderLinesColor: { value: new THREE.Color(options.colors.shoulderLines) },
          uShoulderLinesWidthPercentage: { value: options.shoulderLinesWidthPercentage },
          uBrokenLinesLengthPercentage: { value: options.brokenLinesLengthPercentage },
          uBrokenLinesWidthPercentage: { value: options.brokenLinesWidthPercentage }
        }
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.z = -options.length / 2;
      mesh.position.x += (this.options.islandWidth / 2 + options.roadWidth / 2) * side;
      this.scene.add(mesh);
    };

    createPlane(-1, true);
    createPlane(1, true);
    createPlane(0, false);

    const renderPass = new RenderPass(this.scene, this.camera);
    const bloomEffect = new BloomEffect({ 
      luminanceThreshold: 0.2, 
      intensity: 1.2,
      mipmapBlur: true
    });
    const effectPass = new EffectPass(this.camera, bloomEffect);
    
    this.composer.addPass(renderPass);
    this.composer.addPass(effectPass);

    container.appendChild(this.renderer.domElement);
    this.tick = this.tick.bind(this);
  }

  tick() {
    if (this.disposed) return;
    const delta = this.clock.getDelta();
    this.uTime.value += delta * this.options.speedUp;
    this.composer.render(delta);
    requestAnimationFrame(this.tick);
  }

  dispose() {
    this.disposed = true;
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
    if (this.composer) {
      this.composer.dispose();
    }
    if (this.container && this.renderer.domElement && this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

const Hyperspeed: FC<HyperspeedProps> = ({ effectOptions }) => {
  const hyperspeedRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<AppEngine | null>(null);
  const [isReady, setIsReady] = useState(false);

  const mergedOptions = useMemo(() => ({
    ...defaultOptions,
    ...effectOptions
  }), [effectOptions]);

  useEffect(() => {
    const container = hyperspeedRef.current;
    if (!container) return;

    let engine: AppEngine | null = null;
    
    // Initial ready check
    if (container.clientWidth > 0) setIsReady(true);

    const timer = setTimeout(() => {
      try {
        if (!container.clientWidth) return;
        engine = new AppEngine(container, mergedOptions);
        engineRef.current = engine;
        engine.tick();
        setIsReady(true);
      } catch (e) {
        console.error("Hyperspeed WebGL failed to initialize:", e);
      }
    }, 200);

    const handleResize = () => {
      if (engine && engine.renderer && engine.camera && container) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        engine.renderer.setSize(w, h);
        engine.camera.aspect = w / h;
        engine.camera.updateProjectionMatrix();
        engine.composer.setSize(w, h);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (engine) {
        engine.dispose();
      }
      engineRef.current = null;
    };
  }, [mergedOptions]);

  return (
    <div ref={hyperspeedRef} className="w-full h-full relative overflow-hidden bg-black" style={{ minHeight: '100px' }}>
      {!isReady && <div className="absolute inset-0 bg-[#09090b]" />}
    </div>
  );
};

export default Hyperspeed;
