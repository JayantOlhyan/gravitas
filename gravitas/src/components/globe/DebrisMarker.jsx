import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useAppStore from '../../store/useAppStore';

const colorCrit = new THREE.Color(0xFF3D00);
const colorHigh = new THREE.Color(0xFF6B2B);
const colorMed = new THREE.Color(0xFFD600);
const colorLow = new THREE.Color(0x00D4FF); // Changed from Green to Cyan per requested instructions

function AsteroidMarker({ obj }) {
    const meshRef = useRef();

    const scaleAlt = 1 + ((obj.alt || 500) / 6371);
    const phi = (90 - (obj.lat || 0)) * (Math.PI / 180);
    const theta = ((obj.lon || 0) + 180) * (Math.PI / 180);

    const x = -(scaleAlt * Math.sin(phi) * Math.cos(theta));
    const z = (scaleAlt * Math.sin(phi) * Math.sin(theta));
    const y = (scaleAlt * Math.cos(phi));

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.003;
            meshRef.current.rotation.y += 0.005;
            meshRef.current.rotation.z += 0.002;
        }
    });

    return (
        <group position={[x, y, z]}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[0.018, 1]} />
                <meshStandardMaterial color="#C8B89A" roughness={0.9} metalness={0.1} />
            </mesh>
            <pointLight distance={0.3} intensity={0.5} color="#00D4FF" />
        </group>
    );
}

export default function DebrisMarker({ debrisData }) {
    const meshRef = useRef();
    const setSelectedObject = useAppStore(state => state.setSelectedObject);
    const setDetailPopupOpen = useAppStore(state => state.setDetailPopupOpen);
    const globeFilter = useAppStore(state => state.globeFilter);
    const orbitTypeFilter = useAppStore(state => state.orbitType);

    const filteredData = useMemo(() => {
        return debrisData.filter(d => {
            if (globeFilter !== 'ALL' && globeFilter !== 'DEBRIS') return false;
            if (orbitTypeFilter !== 'ALL' && d.orbitType !== orbitTypeFilter) return false;
            return true;
        });
    }, [debrisData, globeFilter, orbitTypeFilter]);

    // Split asteroids vs normal debris
    const standardDebris = useMemo(() => filteredData.filter(d => d.orbitType !== 'NEO'), [filteredData]);
    const asteroids = useMemo(() => filteredData.filter(d => d.orbitType === 'NEO'), [filteredData]);

    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [hoverPos, setHoverPos] = useState(null);
    const [hoverColor, setHoverColor] = useState(null);

    const topRiskIndices = useRef([]);
    const baseMatrices = useRef([]);

    useEffect(() => {
        if (!meshRef.current) return;
        const mesh = meshRef.current;
        const dummy = new THREE.Object3D();
        const tempColor = new THREE.Color();

        topRiskIndices.current = [];
        baseMatrices.current = [];

        const scoredDebris = [];

        standardDebris.forEach((obj, i) => {
            const scaleAlt = 1 + ((obj.alt || 500) / 6371);
            const phi = (90 - (obj.lat || 0)) * (Math.PI / 180);
            const theta = ((obj.lon || 0) + 180) * (Math.PI / 180);

            const x = -(scaleAlt * Math.sin(phi) * Math.cos(theta));
            const z = (scaleAlt * Math.sin(phi) * Math.sin(theta));
            const y = (scaleAlt * Math.cos(phi));

            dummy.position.set(x, y, z);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);

            // Store base matrix for restoring after animations/hover
            baseMatrices.current.push(dummy.matrix.clone());

            let score = 0;
            if (obj.orbitType === 'LEO') score += 4;
            score += ((obj.velocity || 7) / 10);
            score += ((obj.eccentricity || 0) * 10);

            scoredDebris.push({ index: i, score });

            if (score >= 8) tempColor.copy(colorCrit);
            else if (score >= 6) tempColor.copy(colorHigh);
            else if (score >= 4) tempColor.copy(colorMed);
            else tempColor.copy(colorLow);

            mesh.setColorAt(i, tempColor);
        });

        // Find top 10 highest risk indices
        scoredDebris.sort((a, b) => b.score - a.score);
        topRiskIndices.current = scoredDebris.slice(0, 10).map(d => d.index);

        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }, [standardDebris]);

    const dummyUpdate = useMemo(() => new THREE.Object3D(), []);

    useFrame(() => {
        if (!meshRef.current || topRiskIndices.current.length === 0) return;

        const time = Date.now();
        const mesh = meshRef.current;

        // Scale oscillates between 1.0 and 2.5
        const bounceScale = 1.75 + 0.75 * Math.sin(time * 0.003);

        topRiskIndices.current.forEach(idx => {
            if (idx === hoveredIdx) return; // skip if hovered, hover takes precedence

            const baseMat = baseMatrices.current[idx];
            if (baseMat) {
                dummyUpdate.matrix.copy(baseMat);
                dummyUpdate.matrix.decompose(dummyUpdate.position, dummyUpdate.quaternion, dummyUpdate.scale);
                dummyUpdate.scale.set(bounceScale, bounceScale, bounceScale);
                dummyUpdate.updateMatrix();
                mesh.setMatrixAt(idx, dummyUpdate.matrix);
            }
        });

        mesh.instanceMatrix.needsUpdate = true;
    });

    const handleClick = (e) => {
        e.stopPropagation();
        if (e.instanceId !== undefined) {
            const obj = standardDebris[e.instanceId];
            if (obj) {
                setSelectedObject(obj);
                setDetailPopupOpen(true);
            }
        }
    };

    const handlePointerMove = (e) => {
        e.stopPropagation();
        if (e.instanceId !== undefined) {
            document.body.style.cursor = 'pointer';
            if (hoveredIdx !== e.instanceId) {
                // Restore previous hovered
                if (hoveredIdx !== null && meshRef.current && baseMatrices.current[hoveredIdx]) {
                    meshRef.current.setMatrixAt(hoveredIdx, baseMatrices.current[hoveredIdx]);
                }

                setHoveredIdx(e.instanceId);

                // Scale up current hovered
                const baseMat = baseMatrices.current[e.instanceId];
                if (meshRef.current && baseMat) {
                    dummyUpdate.matrix.copy(baseMat);
                    dummyUpdate.matrix.decompose(dummyUpdate.position, dummyUpdate.quaternion, dummyUpdate.scale);

                    setHoverPos(dummyUpdate.position.clone());

                    const instColor = new THREE.Color();
                    meshRef.current.getColorAt(e.instanceId, instColor);
                    setHoverColor(instColor);

                    dummyUpdate.scale.set(3, 3, 3);
                    dummyUpdate.updateMatrix();
                    meshRef.current.setMatrixAt(e.instanceId, dummyUpdate.matrix);
                    meshRef.current.instanceMatrix.needsUpdate = true;
                }
            }
        }
    };

    const handlePointerOut = () => {
        document.body.style.cursor = 'auto';
        if (hoveredIdx !== null && meshRef.current && baseMatrices.current[hoveredIdx]) {
            meshRef.current.setMatrixAt(hoveredIdx, baseMatrices.current[hoveredIdx]);
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
        setHoveredIdx(null);
        setHoverPos(null);
    };

    return (
        <group>
            {/* Standard Debris */}
            <instancedMesh
                ref={meshRef}
                args={[null, null, standardDebris.length]}
                onClick={handleClick}
                onPointerMove={handlePointerMove}
                onPointerOut={handlePointerOut}
            >
                <sphereGeometry args={[0.006, 8, 8]} />
                <meshBasicMaterial toneMapped={false} />
            </instancedMesh>

            {/* Hover light */}
            {hoverPos && hoverColor && (
                <pointLight position={hoverPos} color={hoverColor} distance={0.5} intensity={1} />
            )}

            {/* Asteroids rendered individually */}
            {asteroids.map(ast => (
                <AsteroidMarker key={ast.id} obj={ast} />
            ))}
        </group>
    );
}
