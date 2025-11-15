import { Play, Pause, Square, Clock } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import type { TimeEntry } from '@kompass/shared/types/entities/time-entry';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useTimer } from '../hooks/useTimer';

import { useToast } from '@/hooks/use-toast';

/**
 * TimerWidget Component
 *
 * Quick-access timer widget for time tracking.
 * Features:
 * - Start/stop/pause timer
 * - Project and task selection
 * - Real-time elapsed time display
 * - Offline support with localStorage
 * - Automatic save on stop
 *
 * @see Phase 1.2 of Time Tracking Implementation Plan
 */
export function TimerWidget() {
  const { toast } = useToast();
  const {
    activeTimer,
    elapsedTime,
    isRunning,
    startTimer,
    stopTimer,
    pauseTimer,
    loading,
  } = useTimer();

  // Form state
  const [projectId, setProjectId] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);

  // Projects list (TODO: fetch from API)
  const [projects] = useState([
    { id: 'project-1', name: 'Project Alpha' },
    { id: 'project-2', name: 'Project Beta' },
    { id: 'project-3', name: 'Project Gamma' },
  ]);

  /**
   * Handle start timer
   */
  const handleStart = useCallback(async () => {
    if (!projectId) {
      toast({
        title: 'Fehler',
        description: 'Bitte wählen Sie ein Projekt aus',
        variant: 'destructive',
      });
      return;
    }

    if (!taskDescription || taskDescription.length < 10) {
      toast({
        title: 'Fehler',
        description:
          'Aufgabenbeschreibung muss mindestens 10 Zeichen lang sein',
        variant: 'destructive',
      });
      return;
    }

    try {
      await startTimer({
        projectId,
        taskDescription,
        isManualEntry: false,
      });

      toast({
        title: 'Timer gestartet',
        description: `Zeiterfassung für "${taskDescription}" läuft`,
      });

      setShowForm(false);
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Timer konnte nicht gestartet werden',
        variant: 'destructive',
      });
    }
  }, [projectId, taskDescription, startTimer, toast]);

  /**
   * Handle stop timer
   */
  const handleStop = useCallback(async () => {
    if (!activeTimer) return;

    try {
      await stopTimer();

      toast({
        title: 'Timer gestoppt',
        description: `Zeiterfassung gespeichert: ${formatDuration(elapsedTime)}`,
      });

      // Reset form
      setProjectId('');
      setTaskDescription('');
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Timer konnte nicht gestoppt werden',
        variant: 'destructive',
      });
    }
  }, [activeTimer, stopTimer, elapsedTime, toast]);

  /**
   * Handle pause timer
   */
  const handlePause = useCallback(async () => {
    try {
      await pauseTimer();

      toast({
        title: 'Timer pausiert',
        description: 'Zeiterfassung pausiert',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Timer konnte nicht pausiert werden',
        variant: 'destructive',
      });
    }
  }, [pauseTimer, toast]);

  /**
   * Format duration in HH:MM:SS
   */
  function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Render timer display
   */
  if (isRunning && activeTimer) {
    return (
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">Timer läuft</CardTitle>
            </div>
            <div className="text-2xl font-mono font-bold text-green-600">
              {formatDuration(elapsedTime)}
            </div>
          </div>
          <CardDescription className="truncate">
            {activeTimer.taskDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePause}
              disabled={loading}
              className="flex-1"
            >
              <Pause className="mr-2 h-4 w-4" />
              Pausieren
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleStop}
              disabled={loading}
              className="flex-1"
            >
              <Square className="mr-2 h-4 w-4" />
              Stoppen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  /**
   * Render start timer form
   */
  if (showForm) {
    return (
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Zeiterfassung starten</CardTitle>
          <CardDescription>Projekt und Aufgabe auswählen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Project selection */}
            <div className="space-y-2">
              <Label htmlFor="project">Projekt</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Projekt wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Task description */}
            <div className="space-y-2">
              <Label htmlFor="task">Aufgabe</Label>
              <Input
                id="task"
                placeholder="Was machen Sie...? (mind. 10 Zeichen)"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {taskDescription.length}/500 Zeichen
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button
                size="sm"
                onClick={handleStart}
                disabled={loading || !projectId || taskDescription.length < 10}
                className="flex-1"
              >
                <Play className="mr-2 h-4 w-4" />
                Starten
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  /**
   * Render start button
   */
  return (
    <Button
      onClick={() => setShowForm(true)}
      className="min-w-[120px]"
      size="default"
    >
      <Clock className="mr-2 h-4 w-4" />
      Zeit erfassen
    </Button>
  );
}
