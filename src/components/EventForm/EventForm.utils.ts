export const rawDbSourcesToArray = (sourcesString: string): string[] => {
  return JSON.parse(sourcesString.replace(/'/g, '"'));
};

export const sourcesArrayToDbString = (sources: string[]): string => {
  // remove falsy values (form cleanup)
  const filteredSources = sources.filter((source) => source);
  const stringifiedSources = JSON.stringify(filteredSources);
  const formattedSources = stringifiedSources.replace(/"/g, "'");
  return formattedSources;
};

export const getDefaultDate = () => {
  const today = new Date();
  return `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
};
