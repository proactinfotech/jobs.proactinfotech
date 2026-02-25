import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Glowing misty sphere inspired by clusterlabs.com/mist */
export function HeroSphere() {
  const [opacity, setOpacity] = useState(0.4);

  useEffect(() => {
    function handleScroll() {
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      // Fade from 0.40 → 0.15 as user scrolls past the hero
      setOpacity(0.4 - progress * 0.25);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{ opacity, zIndex: -1 }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#F0531C" />
        <pointLight position={[-5, -3, 3]} intensity={0.4} color="#FFA74F" />
        <pointLight position={[0, -4, 2]} intensity={0.3} color="#09332C" />
        <pointLight position={[3, 0, -2]} intensity={0.3} color="#2E4B3C" />
        <MistSphere />
      </Canvas>
    </div>
  );
}

function MistSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#F0531C") },
      uColor2: { value: new THREE.Color("#FFA74F") },
      uColor3: { value: new THREE.Color("#F0531C") }, // Darker/stronger color for border contrast
    }),
    []
  );

  // Initial placement values
  const startPos = useMemo(() => new THREE.Vector3(1.2, 0, 0), []);
  const endPos = useMemo(() => new THREE.Vector3(0, 0, -1.5), []);
  const startScale = 1.4;
  const endScale = 1.2;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08;
      meshRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;

      // Scroll-driven shrink & center
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const progress = Math.min(Math.max(scrollY / vh, 0), 1);

      const targetX = THREE.MathUtils.lerp(startPos.x, endPos.x, progress);
      const targetY = THREE.MathUtils.lerp(startPos.y, endPos.y, progress);
      const targetZ = THREE.MathUtils.lerp(startPos.z, endPos.z, progress);
      const targetScale = THREE.MathUtils.lerp(startScale, endScale, progress);

      // Smooth interpolation for buttery feel
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
      );
    }
  });

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;
    
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      vUv = uv;
      vNormal = normal;
      float noise = snoise(position * 1.5 + uTime * 0.15) * 0.15;
      float noise2 = snoise(position * 3.0 - uTime * 0.1) * 0.08;
      vec3 newPosition = position + normal * (noise + noise2);
      vPosition = newPosition;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    
    void main() {
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      // Sharper fresnel for stronger border contrast
      float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.5);
      
      float mixFactor = sin(vPosition.y * 2.0 + uTime * 0.2) * 0.5 + 0.5;
      vec3 baseColor = mix(uColor1, uColor2, mixFactor);
      
      // Deeper, more pronounced shadows
      float shadow = pow(max(dot(vNormal, vec3(0.3, 0.8, 0.5)), 0.0), 1.5);
      baseColor *= 0.3 + shadow * 0.7;
      
      // Stronger ambient occlusion for contrast
      float ao = 0.5 + 0.5 * dot(vNormal, vec3(0.0, 1.0, 0.0));
      baseColor *= 0.5 + ao * 0.5;
      
      // High contrast border mixing
      vec3 finalColor = mix(baseColor, uColor3, fresnel * 0.7);
      float alpha = 0.6 + fresnel * 0.4;
      
      gl_FragColor = vec4(finalColor + fresnel * uColor3 * 0.3, alpha);
    }
  `;

  return (
    <mesh ref={meshRef} position={[1.2, 0.2, 0]} scale={1.4}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
