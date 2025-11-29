import React from 'react';

interface DecoCornerProps {
    className: string;
}

const DecoCorner: React.FC<DecoCornerProps> = ({ className }) => (
    <div className={`absolute w-4 h-4 ${className}`} />
);

export default DecoCorner;