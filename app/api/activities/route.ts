import { NextResponse } from 'next/server';
import { activities } from './[id]/route';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const currentId = searchParams.get('currentId');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredActivities = activities;

    if (category) {
        // Filter activities by category or location (for Cappadocia activities)
        filteredActivities = activities.filter(activity => 
            activity.category === category ||
            (activity.location.toLowerCase().includes('kapadokya') && 
             activity.category !== category) // Include other Cappadocia activities
        );

        // Remove current activity from results if currentId is provided
        if (currentId) {
            filteredActivities = filteredActivities.filter(
                activity => activity.id !== parseInt(currentId)
            );
        }

        // Limit the number of results
        filteredActivities = filteredActivities
            .sort(() => Math.random() - 0.5) // Randomly sort activities
            .slice(0, limit);
    }

    return NextResponse.json(filteredActivities);
} 