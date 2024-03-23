import { useState } from 'react';

export const useContextMenuPosition = () => {
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    const calculatePosition = (e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = rect.width / 2 - 40;
        const offsetY = rect.height / 2;
        setContextMenuPosition({ x: offsetX, y: offsetY });
    };

    return { contextMenuPosition, calculatePosition };
};