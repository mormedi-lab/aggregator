export const getDomainFromUrl = (url: string): string => {
    try {
      const { hostname } = new URL(url);
      return hostname.replace(/^www\./, '');
    } catch (e) {
      return '';
    }
  };
  