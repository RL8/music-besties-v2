import { NextRequest, NextResponse } from "next/server";
import { WorkflowEngine } from "@/lib/workflow-engine";

// Global workflow engine instance
let workflowEngine: WorkflowEngine | null = null;

function getWorkflowEngine(): WorkflowEngine {
  if (!workflowEngine) {
    workflowEngine = new WorkflowEngine();
  }
  return workflowEngine;
}

// Start a new workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    const engine = getWorkflowEngine();

    switch (action) {
      case 'start_workflow':
        const workflowId = await engine.startWorkflow('research_canvas', {
          query: data.query,
          currentTopic: data.currentTopic
        });

        return NextResponse.json({
          success: true,
          workflowId,
          message: 'Workflow started successfully'
        });

      case 'get_workflow':
        const workflow = engine.getWorkflow(data.workflowId);
        if (!workflow) {
          return NextResponse.json(
            { error: 'Workflow not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          workflow
        });

      case 'pause_workflow':
        engine.pauseWorkflow(data.workflowId);
        return NextResponse.json({
          success: true,
          message: 'Workflow paused'
        });

      case 'resume_workflow':
        engine.resumeWorkflow(data.workflowId);
        return NextResponse.json({
          success: true,
          message: 'Workflow resumed'
        });

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Workflow API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get workflow status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('workflowId');

    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID required' },
        { status: 400 }
      );
    }

    const engine = getWorkflowEngine();
    const workflow = engine.getWorkflow(workflowId);

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      workflow
    });
  } catch (error) {
    console.error('Workflow API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 