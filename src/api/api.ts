import { ShareGPTSubmitBodyInterface } from "@type/api";
import { Attachment } from "@type/chat";

export interface AnalysisResponse {
  response: string;
  status: string;
  image_url: string;
  image_name: string;
}

export interface UploadResponse {
  images: {
    image_url: string;
    image_name: string;
  }[];
  status: string;
}

export interface PersonaResponse {
  refined_prompt: string;
  status: string;
}

export const uploadImages = async (images: File[]): Promise<UploadResponse> => {
  const formData = new FormData();
  images.forEach(image => formData.append('images', image));
  
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload-images`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
};

export const getImageAnalysis = async (
  imageUrls: { image_url: string; image_name: string }[],
  question: string,
  admin_persona: string,
): Promise<AnalysisResponse[]> => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/analyze-images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_urls: imageUrls,
      question,
      admin_persona: admin_persona,
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
};

export const refinePersona = async (initialPrompt: string): Promise<PersonaResponse> => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/refine-persona`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ initial_prompt: initialPrompt })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
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