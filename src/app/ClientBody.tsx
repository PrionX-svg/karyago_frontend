"use client";
import { Toaster } from "sonner";
import {ReactNode, useEffect} from 'react';

interface ClientBodyProps {
    children: ReactNode;
    nonce: string;
}

export default function ClientBody({ children, nonce }: ClientBodyProps) {
    useEffect(() => {
        // Make the nonce globally available
        if (nonce) {
            window.__nonce = nonce;
        }
    }, [nonce]);

    return (
        <body className="antialiased" data-nonce={nonce}>
                {children}
                <Toaster richColors
                    toastOptions={{
                        classNames: {
                            success: 'bg-green-500 text-white',
                            error: 'bg-red-500 text-white',
                        }
                    }}
                />
        </body>
    );
}

// Add type to window object
declare global {
    interface Window {
        __nonce?: string;
    }
}