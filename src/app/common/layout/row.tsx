import React, { ReactNode } from 'react';

export default function Row({ children }: { children: ReactNode }) {
    return (
        <div className="row">
            {children}
        </div>
    );
}