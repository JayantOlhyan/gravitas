import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useTexture, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import GlobeControls from './GlobeControls';
import DebrisMarker from './DebrisMarker';
import OrbitPath from './OrbitPath';
import { useDebrisList } from '../../hooks/useDebrisData';
import useAppStore from '../../store/useAppStore';

const AtmosphereMaterial = shaderMaterial(
    { glowColor: new THREE.Color('#4FC3F7') },
    // vertex
    `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
    // fragment
    `
  uniform vec3 glowColor;
  varying vec3 vNormal;
  void main() {
    float intensity = pow(1.0 + dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    gl_FragColor = vec4(glowColor, intensity * 0.7);
  }
  `
);
extend({ AtmosphereMaterial });

function StarField() {
    const stars1 = useMemo(() => {
        const pts = new Float32Array(15000 * 3);
        const v = new THREE.Vector3();
        for (let i = 0; i < 15000; i++) {
            v.randomDirection().multiplyScalar(90 + Math.random() * 20);
            pts[i * 3] = v.x; pts[i * 3 + 1] = v.y; pts[i * 3 + 2] = v.z;
        }
        return pts;
    }, []);
    const stars2 = useMemo(() => {
        const pts = new Float32Array(3000 * 3);
        const v = new THREE.Vector3();
        for (let i = 0; i < 3000; i++) {
            v.randomDirection().multiplyScalar(90 + Math.random() * 20);
            pts[i * 3] = v.x; pts[i * 3 + 1] = v.y; pts[i * 3 + 2] = v.z;
        }
        return pts;
    }, []);
    return (
        <group>
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={15000} array={stars1} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial size={0.15} color="#FFFFFF" sizeAttenuation transparent opacity={0.8} />
            </points>
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={3000} array={stars2} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial size={0.3} color="#FFFFFF" sizeAttenuation transparent opacity={0.9} />
            </points>
        </group>
    );
}

function EarthSphere() {
    const earthRef = useRef();
    const cloudsRef = useRef();

    const { globe } = useAppStore(state => state.appSettings);
    const sunDir = useMemo(() => new THREE.Vector3(5, 3, 5).normalize(), []);

    const [daymap, nightmap, clouds, normalmap, specmap] = useTexture([
        '/textures/earth_daymap.jpg',
        '/textures/earth_nightmap.jpg',
        '/textures/earth_clouds.png',
        '/textures/earth_normal.png',
        '/textures/earth-specular.jpg'
    ]);

    const customEarthMaterial = useMemo(() => {
        const mat = new THREE.MeshPhongMaterial({
            map: daymap,
            normalMap: normalmap,
            specularMap: specmap,
            specular: new THREE.Color(0x222222),
            shininess: 35
        });

        mat.onBeforeCompile = (shader) => {
            shader.uniforms.tNight = { value: nightmap };
            shader.uniforms.sunDirection = { value: sunDir };

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_pars_fragment>',
                `#include <map_pars_fragment>
                 uniform sampler2D tNight;
                 uniform vec3 sunDirection;
                `
            );

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <emissivemap_fragment>',
                `#include <emissivemap_fragment>
                 vec3 viewSunDir = normalize((viewMatrix * vec4(sunDirection, 0.0)).xyz);
                 float intensityPos = dot(normal, viewSunDir);
                 float blend = smoothstep(-0.2, 0.2, intensityPos);
                 
                 vec4 nightColor = texture2D( tNight, vMapUv );
                 totalEmissiveRadiance += nightColor.rgb * (1.0 - blend) * 2.0; 
                `
            );
        };
        return mat;
    }, [daymap, nightmap, normalmap, specmap, sunDir]);

    useFrame(() => {
        if (globe.autoRotation) {
            if (earthRef.current) earthRef.current.rotation.y += 0.0005 * globe.rotationSpeed;
            if (cloudsRef.current) cloudsRef.current.rotation.y += 0.0008 * globe.rotationSpeed;
        }
    });

    return (
        <group>
            {/* Atmosphere Glow */}
            {globe.atmosphereGlow !== false && (
                <mesh>
                    <sphereGeometry args={[1.02, 64, 64]} />
                    <atmosphereMaterial transparent side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
                </mesh>
            )}

            {/* Earth Map */}
            <mesh ref={earthRef} material={customEarthMaterial}>
                <sphereGeometry args={[1, 64, 64]} />
            </mesh>
            {/* Clouds */}
            {
                globe.cloudLayer && (
                    <mesh ref={cloudsRef}>
                        <sphereGeometry args={[1.005, 32, 32]} />
                        <meshPhongMaterial
                            map={clouds}
                            transparent={true}
                            opacity={0.4}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                        />
                    </mesh>
                )
            }
        </group >
    );
}

export default function EarthGlobe() {
    const { globe, display } = useAppStore(state => state.appSettings);
    // Parse max rendering option
    const limit = globe.maxOrbitsRendered === 'all' ? 10000 : parseInt(globe.maxOrbitsRendered, 10);

    // Debris fetch count based on max rendered setting
    const { data: debrisData } = useDebrisList(limit > 2000 ? limit : 2000);
    const selectedObject = useAppStore(state => state.selectedObject);

    const topRiskData = useMemo(() => {
        if (!debrisData || !Array.isArray(debrisData)) return [];
        const sorted = [...debrisData].sort((a, b) => (b.velocity || 0) - (a.velocity || 0));
        return sorted.slice(0, Math.min(50, limit));
    }, [debrisData, limit]);

    return (
        <div className="w-full h-full relative" aria-label="Interactive 3D Earth Globe showing orbital debris and asteroid positions">
            <Canvas
                camera={{ position: [0, 0, 3.5], fov: 45 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                    outputColorSpace: THREE.SRGBColorSpace
                }}
            >
                <ambientLight color="#0A1628" intensity={0.3} />
                <directionalLight position={[5, 3, 5]} color="#FFF5E4" intensity={1.8} />
                <pointLight position={[5, 3, 5]} color="#FF9500" intensity={0.4} distance={20} />

                <StarField />

                <Suspense fallback={null}>
                    <EarthSphere />
                </Suspense>

                {globe.showDebrisMarkers && Array.isArray(debrisData) && <DebrisMarker debrisData={debrisData} />}

                {globe.showOrbitalPaths && topRiskData.map(obj => (
                    <OrbitPath key={`path-${obj.id}`} debrisObj={obj} isSelected={selectedObject?.id === obj.id} colorMode={globe.orbitColorMode} />
                ))}

                {selectedObject && !topRiskData.find(x => x.id === selectedObject.id) && (
                    <OrbitPath debrisObj={selectedObject} isSelected colorMode={globe.orbitColorMode} />
                )}

                <GlobeControls />

                <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={0.2} mipmapBlur intensity={0.4} radius={0.7} />
                    <ChromaticAberration offset={[0.0005, 0.0005]} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
