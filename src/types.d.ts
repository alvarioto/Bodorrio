export { };

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
        }
    }
}
