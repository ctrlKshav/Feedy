// api.ts
export interface AnalysisResponse {
  response: string;
  status: string;
}

export const getImageAnalysis = async (
  imageFile: File,
  question: string
): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('question', question);

  const response = await fetch('http://localhost:8000/analyze-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const data = await response.json();
  return data;
};