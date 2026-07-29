/**
 * Mock Compatibility Service
 * 
 * This service provides mock implementations for auto-linking suggestions.
 * In production, these functions should be replaced with actual API calls.
 * 
 * TODO: Replace mock implementations with real API endpoints when backend is ready
 */

export interface LinkSuggestion {
  id: string;
  partId: number;
  vehicleModelId: number;
  platformCode: string;
  source: string;
  confidence: number;
  createdAt?: string;
  dismissedAt?: string | null;
  confirmedAt?: string | null;
}

export interface SuggestionFilter {
  minConfidence?: number;
  maxResults?: number;
  excludeDismissed?: boolean;
  partIds?: number[];
  vehicleIds?: number[];
}

// Mock dismissed suggestions storage (in production, this would be backend data)
const dismissedSuggestionIds = new Set<string>();

/**
 * Get auto-linking suggestions
 * TODO: Replace with actual API call: GET /api/compatibility/suggestions
 */
export async function getSuggestions(filters?: SuggestionFilter): Promise<LinkSuggestion[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
  
  const mockSuggestions: LinkSuggestion[] = [
    {
      id: 'sugg_001',
      partId: 1, // HON-14401-KWW-600 - โซ่ราวลิ้น
      vehicleModelId: 2, // Honda Click 110i
      platformCode: 'HON-110-SCOOTER',
      source: 'Platform Match + Engine CC',
      confidence: 85,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 'sugg_002', 
      partId: 1, // โซ่ราวลิ้น Wave 110i
      vehicleModelId: 3, // Honda Scoopy i  
      platformCode: 'HON-110-SCOOTER',
      source: 'Platform Match + Engine CC',
      confidence: 82,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 'sugg_003',
      partId: 2, // YAM-5YP-E4450-00 - ไส้กรองอากาศ
      vehicleModelId: 8, // Yamaha NMAX 155
      platformCode: 'YAM-155-SCOOTER',
      source: 'Cross Reference + Engine Family',
      confidence: 76,
      createdAt: '2024-01-15T11:15:00Z',
    },
    {
      id: 'sugg_004',
      partId: 5, // ผ้าเบรค
      vehicleModelId: 2, // Honda Click 110i
      platformCode: 'HON-DISC-BRAKE-STD',
      source: 'Brake System Match',
      confidence: 92,
      createdAt: '2024-01-15T09:45:00Z',
    },
    {
      id: 'sugg_005',
      partId: 7, // น้ำมันเครื่อง
      vehicleModelId: 4, // Honda Click 125i
      platformCode: 'HON-4STROKE-STD',
      source: 'Engine Type + Viscosity Match',
      confidence: 95,
      createdAt: '2024-01-15T14:20:00Z',
    },
    {
      id: 'sugg_006',
      partId: 6, // หลอดไฟหน้า LED
      vehicleModelId: 8, // Yamaha NMAX 155
      platformCode: 'STD-LED-H4',
      source: 'Lighting System Standard',
      confidence: 68, // Low confidence for warning test
      createdAt: '2024-01-15T16:10:00Z',
    },
    {
      id: 'sugg_007',
      partId: 3, // ผ้าเบรคหลัง
      vehicleModelId: 1, // Honda Wave 110i
      platformCode: 'HON-DRUM-BRAKE-STD',
      source: 'Previously Dismissed Test', // This will be dismissed for testing
      confidence: 78,
      createdAt: '2024-01-14T13:30:00Z',
    },
    {
      id: 'sugg_008',
      partId: 9, // ยางใน
      vehicleModelId: 5, // Honda PCX 150
      platformCode: 'STD-TIRE-14INCH',
      source: 'Tire Size Match',
      confidence: 88,
      createdAt: '2024-01-15T12:00:00Z',
    },
    {
      id: 'sugg_009',
      partId: 4, // น้ำมันเกียร์
      vehicleModelId: 10, // Suzuki Raider 150
      platformCode: 'SUZUKI-CVT-STD',
      source: 'Transmission Type Match',
      confidence: 65, // Another low confidence case
      createdAt: '2024-01-15T08:15:00Z',
    },
    {
      id: 'sugg_010',
      partId: 8, // คลัทช์
      vehicleModelId: 11, // Kawasaki Ninja 250
      platformCode: 'KAW-WET-CLUTCH',
      source: 'Clutch System Match',
      confidence: 91,
      createdAt: '2024-01-15T15:45:00Z',
    },
    // Additional test cases
    {
      id: 'sugg_011',
      partId: 2, // ไส้กรองอากาศ
      vehicleModelId: 9, // Yamaha AEROX 155
      platformCode: 'YAM-155-SCOOTER',
      source: 'Engine Family Match + Air Flow Pattern',
      confidence: 89,
      createdAt: '2024-01-16T09:30:00Z',
    },
    {
      id: 'sugg_012',
      partId: 1, // โซ่ราวลิ้น
      vehicleModelId: 4, // Honda Click 125i
      platformCode: 'HON-CHAIN-DRIVE',
      source: 'Chain Drive System Match',
      confidence: 63, // Very low confidence - should show strong warning
      createdAt: '2024-01-16T11:20:00Z',
    },
    {
      id: 'sugg_013',
      partId: 5, // ผ้าเบรค
      vehicleModelId: 3, // Honda Scoopy i
      platformCode: 'HON-DISC-BRAKE-STD',
      source: 'Brake Caliper Compatibility',
      confidence: 87,
      createdAt: '2024-01-16T13:45:00Z',
    },
    {
      id: 'sugg_014',
      partId: 6, // หลอดไฟหน้า LED
      vehicleModelId: 5, // Honda PCX 150
      platformCode: 'STD-LED-H4',
      source: 'Voltage & Socket Match',
      confidence: 93,
      createdAt: '2024-01-16T15:10:00Z',
    },
    {
      id: 'sugg_015',
      partId: 10, // ยางนอก (สมมติ)
      vehicleModelId: 7, // Yamaha Exciter 150
      platformCode: 'TIRE-SIZE-17INCH',
      source: 'Rim Size & Load Rating Match',
      confidence: 96,
      createdAt: '2024-01-16T16:30:00Z',
    },
  ];

  // Pre-dismiss some suggestions for testing "dismissed" behavior
  dismissedSuggestionIds.add('sugg_007'); // Previously dismissed
  dismissedSuggestionIds.add('sugg_012'); // Another dismissed for testing filters

  let filteredSuggestions = mockSuggestions;

  // Apply filters
  if (filters) {
    if (filters.excludeDismissed) {
      filteredSuggestions = filteredSuggestions.filter(s => !dismissedSuggestionIds.has(s.id));
    }
    
    if (filters.minConfidence !== undefined) {
      filteredSuggestions = filteredSuggestions.filter(s => s.confidence >= filters.minConfidence!);
    }
    
    if (filters.partIds?.length) {
      filteredSuggestions = filteredSuggestions.filter(s => filters.partIds!.includes(s.partId));
    }
    
    if (filters.vehicleIds?.length) {
      filteredSuggestions = filteredSuggestions.filter(s => filters.vehicleIds!.includes(s.vehicleModelId));
    }
    
    if (filters.maxResults) {
      filteredSuggestions = filteredSuggestions.slice(0, filters.maxResults);
    }
  }

  // Default: exclude dismissed and limit results
  if (!filters?.excludeDismissed) {
    filteredSuggestions = filteredSuggestions.filter(s => !dismissedSuggestionIds.has(s.id));
  }
  
  if (!filters?.maxResults) {
    filteredSuggestions = filteredSuggestions.slice(0, 6); // Default limit
  }

  return filteredSuggestions;
}

/**
 * Confirm a single suggestion
 * TODO: Replace with actual API call: POST /api/compatibility/suggestions/{id}/confirm
 */
export async function confirmSuggestion(suggestionId: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
  
  // TODO: In real implementation, this would:
  // 1. Create a new CompatibilityMap record
  // 2. Mark suggestion as confirmed in backend
  // 3. Remove from pending suggestions
  
  console.log(`[Mock] Confirmed suggestion: ${suggestionId}`);
  
  // Simulate potential API error (uncomment for testing)
  // if (Math.random() < 0.1) {
  //   throw new Error('Network error occurred');
  // }
}

/**
 * Dismiss a single suggestion
 * TODO: Replace with actual API call: POST /api/compatibility/suggestions/{id}/dismiss
 */
export async function dismissSuggestion(suggestionId: string, reason?: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
  
  // Add to dismissed set (in production, this would be backend storage)
  dismissedSuggestionIds.add(suggestionId);
  
  console.log(`[Mock] Dismissed suggestion: ${suggestionId}`, reason ? `Reason: ${reason}` : '');
  
  // TODO: In real implementation, this would:
  // 1. Mark suggestion as dismissed in backend with reason
  // 2. Add to user's dismissed suggestions list
  // 3. Optionally use for ML training data
}

/**
 * Confirm multiple suggestions in bulk
 * TODO: Replace with actual API call: POST /api/compatibility/suggestions/bulk-confirm
 */
export async function confirmBulkSuggestions(suggestionIds: string[]): Promise<void> {
  // Simulate API delay (longer for bulk operation)
  await new Promise(resolve => setTimeout(resolve, 800 + suggestionIds.length * 100));
  
  // Process each suggestion
  for (const id of suggestionIds) {
    console.log(`[Mock] Bulk confirmed suggestion: ${id}`);
  }
  
  // TODO: In real implementation, this would:
  // 1. Create multiple CompatibilityMap records in single transaction
  // 2. Mark all suggestions as confirmed
  // 3. Return success/failure status for each
  
  // Simulate potential partial failure (uncomment for testing)
  // if (suggestionIds.length > 3 && Math.random() < 0.2) {
  //   throw new Error('Bulk operation partially failed');
  // }
}

/**
 * Get suggestion statistics
 * TODO: Replace with actual API call: GET /api/compatibility/suggestions/stats
 */
export async function getSuggestionStats(): Promise<{
  total: number;
  confirmed: number;
  dismissed: number;
  pending: number;
  averageConfidence: number;
}> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock statistics
  return {
    total: 156,
    confirmed: 89,
    dismissed: 23,
    pending: 44,
    averageConfidence: 82.5,
  };
}

/**
 * Reset dismissed suggestions (for testing purposes)
 */
export function resetDismissedSuggestions(): void {
  dismissedSuggestionIds.clear();
  console.log('[Mock] Reset all dismissed suggestions');
}

/**
 * Simulate empty suggestions state (for testing)
 */
export async function getEmptySuggestions(): Promise<LinkSuggestion[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return []; // Return empty array to test empty state
}

/**
 * Simulate network error (for testing error handling)
 */
export async function getErrorSuggestions(): Promise<LinkSuggestion[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  throw new Error('Network connection failed. Please check your internet connection.');
}

/**
 * Get suggestions with specific confidence ranges (for testing filters)
 */
export async function getHighConfidenceSuggestions(): Promise<LinkSuggestion[]> {
  const allSuggestions = await getSuggestions();
  return allSuggestions.filter(s => s.confidence >= 90);
}

export async function getLowConfidenceSuggestions(): Promise<LinkSuggestion[]> {
  const allSuggestions = await getSuggestions();
  return allSuggestions.filter(s => s.confidence < 70);
}

export default {
  getSuggestions,
  confirmSuggestion,
  dismissSuggestion,
  confirmBulkSuggestions,
  getSuggestionStats,
  resetDismissedSuggestions,
  // Testing utilities
  getEmptySuggestions,
  getErrorSuggestions,
  getHighConfidenceSuggestions,
  getLowConfidenceSuggestions,
};