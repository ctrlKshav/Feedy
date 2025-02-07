// api.ts
import { ShareGPTSubmitBodyInterface } from "@type/api";
import { Attachment } from "@type/chat";
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

  // const response = await fetch('https://backend-sparkling-flower-4578.fly.dev/analyze-image', {
  //   method: 'POST',
  //   body: formData,
  // });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const data = await response.json();
  return data;
};

export const submitShareGPT = async (body: ShareGPTSubmitBodyInterface) => {
  const request = await fetch('https://sharegpt.com/api/conversations', {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const response = await request.json();
  const { id } = response;
  const url = `https://shareg.pt/${id}`;
  window.open(url, '_blank');
};