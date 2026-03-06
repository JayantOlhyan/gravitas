import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Stars } from '@react-three/drei';
import * as THREE from 'three';
import GlobeControls from './GlobeControls';
import DebrisMarker from './DebrisMarker';
import OrbitPath from './OrbitPath';
import { useDebrisList } from '../../hooks/useDebrisData';
import useAppStore from '../../store/useAppStore';

function EarthSphere() {
    const earthRef = useRef();
    const cloudsRef = useRef();

    const { globe } = useAppStore(state => state.appSettings);

    const [daymap, clouds, spec] = useTexture([
        '/textures/earth_daymap.jpg',
        '/textures/earth_clouds.jpg',
        '/textures/earth_spec.jpg'
    ]);

    useFrame(() => {
        if (globe.autoRotation) {
            if (earthRef.current) earthRef.current.rotation.y += 0.0005 * globe.rotationSpeed;
            if (cloudsRef.current) cloudsRef.current.rotation.y += 0.0008 * globe.rotationSpeed;
        }
    });

    return (
        <group>
            {/* Earth Map */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshPhongMaterial
                    map={daymap}
                    specularMap={spec}
                    specular={new THREE.Color(0x111111)}
                    shininess={15}
                />
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
            <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
                <ambientLight intensity={0.2} />
                <directionalLight position={[5, 3, 5]} intensity={1.5} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

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
            </Canvas>
        </div>
    );
}
