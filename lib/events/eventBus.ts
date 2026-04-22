// ═══════════════════════════════════════════════════════════
// Readify — Event Bus (Core System)
// Lightweight typed event bus for engine-driven architecture
// ═══════════════════════════════════════════════════════════

// ── Event Types ──
export type EventType =
  | 'SESSION_START'
  | 'SESSION_HEARTBEAT'
  | 'SESSION_END'
  | 'SESSION_CRASH_RECOVERED'
  | 'PROGRESS_UPDATED'
  | 'STREAK_UPDATED'
  | 'CONTRACT_EVALUATED'
  | 'SUMMARY_GENERATED'
  | 'SUMMARY_FAILED';

// ── Event Payloads ──
export interface SessionStartPayload {
  sessionId: string;
  userId: string;
  bookId: string;
  startPage: number;
}

export interface SessionHeartbeatPayload {
  sessionId: string;
  elapsedSeconds: number;
  idleSeconds: number;
}

export interface SessionEndPayload {
  sessionId: string;
  userId: string;
  bookId: string;
  pagesRead: number;
  startPage: number;
  endPage: number;
  durationSeconds: number;
  idleSeconds: number;
  notes: string | null;
  topicTags: string[];
  chapterRange: string | null;
}

export interface ProgressUpdatedPayload {
  userId: string;
  bookId: string;
  currentPage: number;
  progressPercent: number;
  totalPagesRead: number;
}

export interface StreakUpdatedPayload {
  userId: string;
  bookId: string;
  currentStreak: number;
  longestStreak: number;
  targetMet: boolean;
  userDate: string;
}

export interface ContractEvaluatedPayload {
  userId: string;
  bookId: string;
  contractId: string;
  dailyTargetMet: boolean;
  weeklyTargetMet: boolean;
}

export interface SummaryPayload {
  sessionId: string;
  summary: string | null;
  error?: string;
}

// ── Payload Map ──
export interface EventPayloadMap {
  SESSION_START: SessionStartPayload;
  SESSION_HEARTBEAT: SessionHeartbeatPayload;
  SESSION_END: SessionEndPayload;
  SESSION_CRASH_RECOVERED: SessionEndPayload;
  PROGRESS_UPDATED: ProgressUpdatedPayload;
  STREAK_UPDATED: StreakUpdatedPayload;
  CONTRACT_EVALUATED: ContractEvaluatedPayload;
  SUMMARY_GENERATED: SummaryPayload;
  SUMMARY_FAILED: SummaryPayload;
}

// ── Event Handler Type ──
type EventHandler<T extends EventType> = (payload: EventPayloadMap[T]) => void | Promise<void>;

// ── Event Bus Class ──
class EventBus {
  private handlers: Map<EventType, Set<EventHandler<any>>> = new Map();
  private debugMode: boolean = false;

  /**
   * Enable debug logging for all events.
   */
  setDebug(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Subscribe to an event. Returns an unsubscribe function.
   */
  on<T extends EventType>(event: T, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(event)?.delete(handler);
    };
  }

  /**
   * Subscribe to an event for one execution only.
   */
  once<T extends EventType>(event: T, handler: EventHandler<T>): () => void {
    const wrappedHandler: EventHandler<T> = (payload) => {
      this.handlers.get(event)?.delete(wrappedHandler);
      return handler(payload);
    };
    return this.on(event, wrappedHandler);
  }

  /**
   * Emit an event. All handlers run, failures are isolated.
   * Returns array of results (null for failed handlers).
   */
  async emit<T extends EventType>(event: T, payload: EventPayloadMap[T]): Promise<void> {
    if (this.debugMode) {
      console.log(`[EventBus] ${event}`, payload);
    }

    const handlers = this.handlers.get(event);
    if (!handlers || handlers.size === 0) return;

    // Run all handlers — failure-isolated
    const promises = Array.from(handlers).map(async (handler) => {
      try {
        await handler(payload);
      } catch (error) {
        // Failure isolation: log but don't break other handlers
        console.error(`[EventBus] Handler failed for ${event}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Remove all handlers for an event (or all events if no event specified).
   */
  off(event?: EventType): void {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }

  /**
   * Get the number of handlers for an event.
   */
  listenerCount(event: EventType): number {
    return this.handlers.get(event)?.size || 0;
  }
}

// ── Singleton Instance ──
export const eventBus = new EventBus();

// Enable debug in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  eventBus.setDebug(true);
}
