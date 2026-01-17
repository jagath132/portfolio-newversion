import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { config } from '../constants/config';

interface SectionContent {
    p: string;
    h2: string;
    content?: string;
}

export const useSectionContent = (sectionId: keyof typeof config.sections) => {
    // Initialize with the hardcoded config as default
    const [data, setData] = useState<SectionContent>(config.sections[sectionId]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to realtime updates
        const docRef = doc(db, 'section_contents', sectionId);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setData(docSnap.data() as SectionContent);
            } else {
                // Find default config again just in case, but state already has it.
                // If doc is deleted, revert to config.
                setData(config.sections[sectionId]);
            }
            setLoading(false);
        }, (error) => {
            console.error(`Error fetching section content using hook for ${sectionId}:`, error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [sectionId]);

    return { ...data, loading };
};
