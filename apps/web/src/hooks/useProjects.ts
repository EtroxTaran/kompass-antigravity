import { useState, useEffect } from 'react';
import { dbService } from '@/lib/db';
import { Project } from '@kompass/shared';

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        const db = dbService.getDB();
        try {
            const result = await db.find({
                selector: { type: 'project' },
            });
            setProjects(result.docs as unknown as Project[]);
        } catch (err) {
            console.error('Error fetching projects', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
        const db = dbService.getDB();
        const changes = db.changes({
            since: 'now',
            live: true,
            include_docs: true,
            filter: (doc) => doc.type === 'project',
        }).on('change', () => {
            fetchProjects();
        });

        return () => {
            changes.cancel();
        };
    }, []);

    const addProject = async (project: Omit<Project, '_id' | '_rev'>) => {
        const db = dbService.getDB();
        const newDoc = {
            ...project,
            _id: `project-${crypto.randomUUID()}`,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            version: 1,
        };
        await db.put(newDoc);
    };

    return { projects, loading, addProject };
}
