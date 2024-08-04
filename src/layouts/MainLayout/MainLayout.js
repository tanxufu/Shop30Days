import React from 'react';
import { Footer, Header } from '~/components';

function MainLayout({ children }) {
    return (
        <main>
            <Header />
            {children}
            <Footer />
        </main>
    );
}

export default MainLayout;
