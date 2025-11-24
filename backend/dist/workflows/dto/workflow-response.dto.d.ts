export declare class WorkflowResponseDto {
    id: string;
    name: string;
    description?: string;
    config: object;
    isActive: boolean;
    isPublished: boolean;
    slug?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class WorkflowListResponseDto {
    workflows: WorkflowResponseDto[];
    total: number;
}
