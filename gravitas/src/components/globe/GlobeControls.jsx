import React from 'react';
import { OrbitControls } from '@react-three/drei';

export default function GlobeControls() {
    return (
        <OrbitControls
            enableDamping={true}
            dampingFactor={0.05}
            enablePan={false}
            minDistance={1.5}
            maxDistance={8}
            zoomSpeed={0.8}
            rotateSpeed={0.6}
        />
    );
}
