import { useState, useCallback } from 'react';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-toastify';

export const useFirestore = (collectionName: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAll = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return data;
        } catch (err: any) {
            setError(err.message);
            toast.error(`Error fetching ${collectionName}: ${err.message}`);
            return [];
        } finally {
            setLoading(false);
        }
    }, [collectionName]);

    const add = useCallback(async (data: any) => {
        setLoading(true);
        try {
            // Add createdAt timestamp
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: Timestamp.now()
            });
            toast.success('Item added successfully');
            return docRef.id;
        } catch (err: any) {
            setError(err.message);
            toast.error(`Error adding to ${collectionName}: ${err.message}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, [collectionName]);

    const update = useCallback(async (id: string, data: any) => {
        setLoading(true);
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: Timestamp.now()
            });
            toast.success('Item updated successfully');
            return true;
        } catch (err: any) {
            setError(err.message);
            toast.error(`Error updating ${collectionName}: ${err.message}`);
            return false;
        } finally {
            setLoading(false);
        }
    }, [collectionName]);

    const remove = useCallback(async (id: string) => {
        setLoading(true);
        try {
            await deleteDoc(doc(db, collectionName, id));
            toast.success('Item deleted successfully');
            return true;
        } catch (err: any) {
            setError(err.message);
            toast.error(`Error deleting from ${collectionName}: ${err.message}`);
            return false;
        } finally {
            setLoading(false);
        }
    }, [collectionName]);

    return { getAll, add, update, remove, loading, error };
};
