import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import useAppStore from '../../store/useAppStore';

const colorCrit = new THREE.Color(0xFF3D00);
const colorHigh = new THREE.Color(0xFF6B2B);
const colorMed = new THREE.Color(0xFFD600);
const colorLow = new THREE.Color(0x00E676);

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

    useEffect(() => {
        if (!meshRef.current) return;
        const mesh = meshRef.current;
        const dummy = new THREE.Object3D();
        const tempColor = new THREE.Color();

        filteredData.forEach((obj, i) => {
            // Earth radius = 1 in our scale. Real Earth = 6371km.
            const scaleAlt = 1 + ((obj.alt || 500) / 6371);

            const phi = (90 - (obj.lat || 0)) * (Math.PI / 180);
            const theta = ((obj.lon || 0) + 180) * (Math.PI / 180);

            const x = -(scaleAlt * Math.sin(phi) * Math.cos(theta));
            const z = (scaleAlt * Math.sin(phi) * Math.sin(theta));
            const y = (scaleAlt * Math.cos(phi));

            dummy.position.set(x, y, z);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);

            // Simple risk computation
            let score = 0;
            if (obj.orbitType === 'LEO') score += 4;
            score += ((obj.velocity || 7) / 10);
            score += ((obj.eccentricity || 0) * 10);

            if (score >= 8) tempColor.copy(colorCrit);
            else if (score >= 6) tempColor.copy(colorHigh);
            else if (score >= 4) tempColor.copy(colorMed);
            else tempColor.copy(colorLow);

            mesh.setColorAt(i, tempColor);
        });

        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }, [filteredData]);

    const handleClick = (e) => {
        e.stopPropagation();
        if (e.instanceId !== undefined) {
            const obj = filteredData[e.instanceId];
            if (obj) {
                setSelectedObject(obj);
                setDetailPopupOpen(true);
            }
        }
    };

    return (
        <instancedMesh
            ref={meshRef}
            args={[null, null, filteredData.length]}
            onClick={handleClick}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshBasicMaterial />
        </instancedMesh>
    );
}
