import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

export default function OrbitPath({ debrisObj, isSelected = false }) {
    const points = useMemo(() => {
        const pts = [];
        const segments = 64;
        const scaleAlt = 1 + ((debrisObj.alt || 500) / 6371);

        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            pts.push(new THREE.Vector3(
                Math.cos(theta) * scaleAlt,
                0,
                Math.sin(theta) * scaleAlt
            ));
        }
        return pts;
    }, [debrisObj.alt]);

    let color = '#1A6EBD'; // standard blue
    let score = 0;
    if (debrisObj.orbitType === 'LEO') score += 4;
    score += ((debrisObj.velocity || 7) / 10);
    score += ((debrisObj.eccentricity || 0) * 10);

    if (score >= 8) color = '#FF3D00';
    else if (score >= 6) color = '#FF6B2B';
    else if (score >= 4) color = '#FFD600';

    if (isSelected) color = '#00D4FF'; // Cyan highlight

    return (
        <group rotation={[0, 0, (debrisObj.inclination || 0) * (Math.PI / 180)]}>
            <Line
                points={points}
                color={color}
                lineWidth={1}
                transparent
                opacity={isSelected ? 1.0 : 0.4}
            />
        </group>
    );
}
