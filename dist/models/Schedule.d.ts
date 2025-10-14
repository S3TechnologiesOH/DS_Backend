/**
 * Schedule Models
 *
 * When and where to play playlists with hierarchical assignment.
 */
export type AssignmentType = 'Customer' | 'Site' | 'Player';
export interface Schedule {
    scheduleId: number;
    customerId: number;
    name: string;
    playlistId: number;
    priority: number;
    startDate: Date | null;
    endDate: Date | null;
    startTime: string | null;
    endTime: string | null;
    daysOfWeek: string | null;
    isActive: boolean;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ScheduleAssignment {
    assignmentId: number;
    scheduleId: number;
    assignmentType: AssignmentType;
    targetCustomerId: number | null;
    targetSiteId: number | null;
    targetPlayerId: number | null;
    createdAt: Date;
}
export interface CreateScheduleDto {
    customerId: number;
    name: string;
    playlistId: number;
    priority?: number;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    daysOfWeek?: string;
    createdBy: number;
}
export interface UpdateScheduleDto {
    name?: string;
    playlistId?: number;
    priority?: number;
    startDate?: string | null;
    endDate?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    daysOfWeek?: string | null;
    isActive?: boolean;
}
export interface CreateScheduleAssignmentDto {
    scheduleId: number;
    assignmentType: AssignmentType;
    targetCustomerId?: number;
    targetSiteId?: number;
    targetPlayerId?: number;
}
export interface ScheduleWithAssignments extends Schedule {
    assignments: ScheduleAssignment[];
    playlistName: string;
}
//# sourceMappingURL=Schedule.d.ts.map