import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => { });

export const useSplashScreen = (delay: number = 1000) => {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            const start = Date.now();

            try {
                await new Promise((resolve) => setTimeout(resolve, delay));
            } catch (e) {
                console.warn("Splash Hook Hatası:", e);
            } finally {
                const end = Date.now();
                setAppIsReady(true);
            }
        }

        prepare();
    }, [delay]);

    useEffect(() => {
        if (appIsReady) {
            SplashScreen.hideAsync().catch(() => { });
        }
    }, [appIsReady]);

    return appIsReady;
};