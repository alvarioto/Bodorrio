import React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'lord-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                src?: string;
                trigger?: string;
                delay?: string | number;
                stroke?: string;
                state?: string;
                colors?: string;
            };
            'animated-icons': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                src?: string;
                trigger?: string;
                attributes?: string;
                height?: string | number;
                width?: string | number;
            };
        }
    }
}
