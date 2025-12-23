import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (error: any) {
      // Handle JWT decryption errors
      console.error('Session error in profile API:', error);
      if (error.message?.includes('decryption') || error.message?.includes('JWT')) {
        return NextResponse.json(
          { error: 'Session expired or invalid. Please log in again.' },
          { status: 401 }
        );
      }
      throw error;
    }
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Use a more defensive approach - select all fields first, then filter
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Extract only the fields we need (handles cases where new fields might not exist in Prisma client yet)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phoneNumber: user.phoneNumber,
      bloodType: (user as any).bloodType || null,
      allergies: (user as any).allergies || null,
      chronicConditions: (user as any).chronicConditions || null,
      emergencyContact: (user as any).emergencyContact || null,
      earthquakeAlerts: (user as any).earthquakeAlerts ?? true,
      airPollutionWarnings: (user as any).airPollutionWarnings ?? true,
      createdAt: user.createdAt,
    };

    // Parse emergency contacts if they exist
    let emergencyContacts = [];
    if (userData.emergencyContact) {
      try {
        emergencyContacts = JSON.parse(userData.emergencyContact);
      } catch {
        emergencyContacts = [];
      }
    }

    return NextResponse.json({
      ...userData,
      emergencyContacts,
    });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch profile',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (error: any) {
      // Handle JWT decryption errors
      console.error('Session error in profile PATCH API:', error);
      if (error.message?.includes('decryption') || error.message?.includes('JWT')) {
        return NextResponse.json(
          { error: 'Session expired or invalid. Please log in again.' },
          { status: 401 }
        );
      }
      throw error;
    }
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (error: any) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json(
        { error: 'Invalid request body. Please check your input.' },
        { status: 400 }
      );
    }

    const {
      name,
      phoneNumber,
      bloodType,
      allergies,
      chronicConditions,
      emergencyContacts,
      earthquakeAlerts,
      airPollutionWarnings,
    } = body;

    // Prepare update data - now all fields are available in Prisma client
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (bloodType !== undefined) updateData.bloodType = bloodType === '' ? null : bloodType;
    if (allergies !== undefined) updateData.allergies = allergies === '' ? null : allergies;
    if (chronicConditions !== undefined) updateData.chronicConditions = chronicConditions === '' ? null : chronicConditions;
    if (earthquakeAlerts !== undefined) updateData.earthquakeAlerts = earthquakeAlerts;
    if (airPollutionWarnings !== undefined) updateData.airPollutionWarnings = airPollutionWarnings;
    if (emergencyContacts !== undefined) {
      updateData.emergencyContact = JSON.stringify(emergencyContacts);
    }

    console.log('Updating user profile:', {
      email: session.user.email,
      updateData,
    });

    // Update user using Prisma - all fields are now type-safe
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
    });

    // Extract fields - all fields are now properly typed in Prisma client
    const userData = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      phoneNumber: updatedUser.phoneNumber,
      bloodType: updatedUser.bloodType || null,
      allergies: updatedUser.allergies || null,
      chronicConditions: updatedUser.chronicConditions || null,
      emergencyContact: updatedUser.emergencyContact || null,
      earthquakeAlerts: updatedUser.earthquakeAlerts ?? true,
      airPollutionWarnings: updatedUser.airPollutionWarnings ?? true,
    };

    // Parse emergency contacts for response
    let parsedContacts = [];
    if (userData.emergencyContact) {
      try {
        parsedContacts = JSON.parse(userData.emergencyContact);
      } catch {
        parsedContacts = [];
      }
    }

    return NextResponse.json({
      ...userData,
      emergencyContacts: parsedContacts,
    });
  } catch (error: any) {
    console.error('Error updating profile - Full error:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack,
      error: error,
    });
    
    // Provide more detailed error information
    const errorMessage = error.message || 'Unknown error occurred';
    
    // Handle Prisma-specific errors
    let statusCode = 500;
    let userFriendlyMessage = 'Failed to update profile';
    
    if (error.code === 'P2002') {
      statusCode = 409; // Conflict - unique constraint violation
      userFriendlyMessage = 'This information already exists. Please use different values.';
    } else if (error.code === 'P2025') {
      statusCode = 404; // Not found
      userFriendlyMessage = 'User not found. Please try logging in again.';
    } else if (error.message) {
      userFriendlyMessage = error.message;
    }
    
    const errorResponse: any = {
      error: userFriendlyMessage,
    };
    
    // Add details in development mode
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = {
        message: errorMessage,
        name: error.name,
        code: error.code,
        // Only include stack in development
        ...(error.stack && { stack: error.stack.split('\n').slice(0, 5).join('\n') }),
      };
    }
    
    console.log('Returning error response:', errorResponse);
    
    return NextResponse.json(
      errorResponse,
      { 
        status: statusCode,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

