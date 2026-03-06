import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

export default function OrbitPath({ debrisObj, isSelected = false, colorMode = 'risk' }) {
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
    let opacity = 0.4;

    if (colorMode === 'type') {
        switch (debrisObj.orbitType) {
            case 'LEO': color = '#00D4FF'; break; // Cyan
            case 'MEO': color = '#1A6EBD'; break; // Blue
            case 'GEO': color = '#B620E0'; break; // Purple
            case 'HEO': color = '#FF3366'; break; // Red/Pink
            default: color = '#FFFFFF';
        }
    } else if (colorMode === 'agency') {
        const colors = ['#00D4FF', '#FF6B2B', '#00E676', '#B620E0', '#FF3D00', '#FFD600'];
        const hash = debrisObj.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        color = colors[hash % colors.length];
    } else {
        // Default: 'risk'
        let score = 0;
        if (debrisObj.orbitType === 'LEO') score += 4;
        score += ((debrisObj.velocity || 7) / 10);
        score += ((debrisObj.eccentricity || 0) * 10);

        if (score >= 8) { color = '#FF3D00'; opacity = 0.9; }
        else if (score >= 6) { color = '#FF6B2B'; opacity = 0.9; }
        else if (score >= 4) { color = '#FFD600'; opacity = 0.8; }
        else if (debrisObj.orbitType === 'NEO') { color = '#00D4FF'; opacity = 0.8; }
        else { color = '#1A6EBD'; opacity = 0.4; } // Standard debris
    }

    if (isSelected) { color = '#00FFCC'; opacity = 1.0; } // Brighter Cyan highlight when selected

    return (
        <group rotation={[0, 0, (debrisObj.inclination || 0) * (Math.PI / 180)]}>
            {/* Fake Glow using a much thicker, highly transparent line */}
            <Line
                points={points}
                color={color}
                lineWidth={6}
                transparent
                opacity={isSelected ? 0.3 : opacity * 0.15}
                depthWrite={false}
                toneMapped={false}
            />
            {/* Core Line */}
            <Line
                points={points}
                color={color}
                lineWidth={2}
                transparent
                opacity={opacity}
                depthWrite={false}
                toneMapped={false}
                dashed={debrisObj.orbitType === 'NEO'}
                dashScale={50}
                dashSize={1}
                gapSize={1}
            />
        </group>
    );
}
