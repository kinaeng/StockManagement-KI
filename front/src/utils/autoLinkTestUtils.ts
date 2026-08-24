/**
 * Auto-Link Testing Utilities
 * 
 * Functions สำหรับทดสอบ AutoLinkSuggestions component ใน developer console
 * การใช้งาน: เปิด dev console แล้วใช้ window.autoLinkTest.*
 */

import * as compatibilityService from '@/services/mockCompatibilityService';
import type { LinkSuggestion } from '@/services/mockCompatibilityService';

// Export testing functions to window object for easy access in console
declare global {
  interface Window {
    autoLinkTest: {
      // Mock service testing
      getEmptySuggestions: () => Promise<LinkSuggestion[]>;
      getErrorSuggestions: () => Promise<LinkSuggestion[]>;
      getHighConfidenceSuggestions: () => Promise<LinkSuggestion[]>;
      getLowConfidenceSuggestions: () => Promise<LinkSuggestion[]>;
      resetDismissedSuggestions: () => void;
      
      // State testing
      simulateSlowNetwork: () => void;
      simulateFastNetwork: () => void;
      
      // Data validation
      validateSuggestionData: () => void;
      
      // Performance testing
      benchmarkSuggestions: () => Promise<void>;
    };
  }
}

export const testUtils = {
  /**
   * Test empty suggestions state
   */
  async getEmptySuggestions() {
    console.log('🔍 Testing empty suggestions state...');
    try {
      const result = await compatibilityService.getEmptySuggestions();
      console.log('✅ Empty suggestions test passed:', result);
      return result;
    } catch (error) {
      console.error('❌ Empty suggestions test failed:', error);
      throw error;
    }
  },

  /**
   * Test error handling
   */
  async getErrorSuggestions() {
    console.log('💥 Testing error handling...');
    try {
      const result = await compatibilityService.getErrorSuggestions();
      console.log('❌ Error test should have failed but passed:', result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('✅ Error test passed (expected error):', errorMessage);
      throw error;
    }
  },

  /**
   * Test high confidence suggestions
   */
  async getHighConfidenceSuggestions() {
    console.log('🎯 Testing high confidence suggestions...');
    try {
      const result = await compatibilityService.getHighConfidenceSuggestions();
      console.log(`✅ Found ${result.length} high confidence suggestions:`, result);
      return result;
    } catch (error) {
      console.error('❌ High confidence test failed:', error);
      throw error;
    }
  },

  /**
   * Test low confidence suggestions with warnings
   */
  async getLowConfidenceSuggestions() {
    console.log('⚠️ Testing low confidence suggestions...');
    try {
      const result = await compatibilityService.getLowConfidenceSuggestions();
      console.log(`🟡 Found ${result.length} low confidence suggestions:`, result);
      result.forEach(s => {
        if (s.confidence < 70) {
          console.warn(`⚠️ Low confidence: ${s.confidence}% for ${s.id}`);
        }
      });
      return result;
    } catch (error) {
      console.error('❌ Low confidence test failed:', error);
      throw error;
    }
  },

  /**
   * Reset dismissed suggestions for clean testing
   */
  resetDismissedSuggestions() {
    console.log('🔄 Resetting dismissed suggestions...');
    compatibilityService.resetDismissedSuggestions();
    console.log('✅ Reset completed');
  },

  /**
   * Simulate slow network for testing loading states
   */
  simulateSlowNetwork() {
    console.log('🐌 Simulating slow network (3s delay)...');
    // This would require modifying the service to accept delay override
    // For now, just log the intention
    console.log('💡 Tip: Modify mockCompatibilityService timeout values to test');
  },

  /**
   * Simulate fast network
   */
  simulateFastNetwork() {
    console.log('⚡ Simulating fast network (100ms delay)...');
    console.log('💡 Tip: Modify mockCompatibilityService timeout values to test');
  },

  /**
   * Validate suggestion data structure
   */
  validateSuggestionData() {
    console.log('🔍 Validating suggestion data structure...');
    
    const requiredFields = ['id', 'partId', 'vehicleModelId', 'platformCode', 'source', 'confidence'];
    
    compatibilityService.getSuggestions().then(suggestions => {
      let isValid = true;
      
      suggestions.forEach((suggestion, index) => {
        requiredFields.forEach(field => {
          if (!(field in suggestion)) {
            console.error(`❌ Missing field '${field}' in suggestion ${index}:`, suggestion);
            isValid = false;
          }
        });
        
        // Validate confidence range
        if (suggestion.confidence < 0 || suggestion.confidence > 100) {
          console.error(`❌ Invalid confidence ${suggestion.confidence} in suggestion ${index}`);
          isValid = false;
        }
        
        // Validate ID format
        if (!suggestion.id.startsWith('sugg_')) {
          console.warn(`⚠️ Non-standard ID format: ${suggestion.id}`);
        }
      });
      
      if (isValid) {
        console.log(`✅ All ${suggestions.length} suggestions have valid structure`);
      } else {
        console.log('❌ Some suggestions have invalid structure');
      }
    }).catch(error => {
      console.error('❌ Failed to validate suggestions:', error);
    });
  },

  /**
   * Benchmark suggestion loading performance
   */
  async benchmarkSuggestions() {
    console.log('⏱️ Benchmarking suggestion loading...');
    
    const iterations = 5;
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      
      try {
        await compatibilityService.getSuggestions();
        const end = performance.now();
        const duration = end - start;
        times.push(duration);
        
        console.log(`Run ${i + 1}: ${duration.toFixed(2)}ms`);
      } catch (error) {
        console.error(`Run ${i + 1} failed:`, error);
      }
    }
    
    if (times.length > 0) {
      const average = times.reduce((a, b) => a + b, 0) / times.length;
      const min = Math.min(...times);
      const max = Math.max(...times);
      
      console.log(`📊 Performance Summary:
        Average: ${average.toFixed(2)}ms
        Min: ${min.toFixed(2)}ms  
        Max: ${max.toFixed(2)}ms
        Runs: ${times.length}/${iterations}`);
    }
  },
};

// Attach to window for console access
if (typeof window !== 'undefined') {
  window.autoLinkTest = testUtils;
  console.log('🧪 AutoLink test utilities loaded. Use window.autoLinkTest.* in console');
}

export default testUtils;