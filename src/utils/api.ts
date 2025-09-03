export interface ClassificationResult {
  class: string;
  confidence: number;
  ripeness_stage: string;
  description: string;
}

const API_BASE_URL = 'http://localhost:5000';

export const classifyImage = async (imageFile: File): Promise<ClassificationResult> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/classify`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Classification failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to classify image');
  }
};