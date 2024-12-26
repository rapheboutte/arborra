import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_ENDPOINTS = {
  gdpr: 'https://data.europa.eu/api/hub/search/datasets',
  hipaa: 'https://healthdata.gov/api/breach-notifications',
  ccpa: 'https://oag.ca.gov/api/enforcement',
  sox: 'https://www.sec.gov/edgar/sec-api/company',
  osha: 'https://enforcedata.dol.gov/api/inspections'
};

export async function GET(request: NextRequest) {
  try {
    const framework = request.nextUrl.searchParams.get('framework');
    
    if (!framework || !API_ENDPOINTS[framework]) {
      return NextResponse.json(
        { error: 'Invalid compliance framework specified' },
        { status: 400 }
      );
    }

    // In development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        complianceScore: Math.floor(Math.random() * 30) + 70,
        status: 'active',
        requirements: [
          {
            id: '1',
            title: `Sample ${framework.toUpperCase()} Requirement`,
            status: 'in_progress',
            priority: 'high',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        details: [
          `Sample ${framework.toUpperCase()} compliance detail 1`,
          `Sample ${framework.toUpperCase()} compliance detail 2`
        ],
        recentUpdates: [
          {
            date: new Date().toISOString(),
            type: 'enforcement',
            description: `Recent ${framework.toUpperCase()} update`
          }
        ]
      });
    }

    const response = await axios.get(API_ENDPOINTS[framework], {
      params: { format: 'json' },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Compliance-Dashboard/1.0'
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance data' },
      { status: 500 }
    );
  }
}
