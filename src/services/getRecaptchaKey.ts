"use client";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export async function getRecaptchaToken(action: string = "submit"): Promise<string | null> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  //Caso não tenha cadastrado o token do recaptcha publica
  if (!siteKey) return null;

  return new Promise((resolve) => {
    //Trava anticrash para o next
    if (typeof window === "undefined" || !window.grecaptcha) {
      resolve(null);
      return;
    }

    //Espera o script do google carregar para gerar o token
    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha!.execute(siteKey, { action });
        resolve(token);
      } catch {
        resolve(null);
      }
    });
  });
}
