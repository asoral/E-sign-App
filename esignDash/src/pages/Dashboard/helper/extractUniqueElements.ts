import { ComponentData } from './Interface';
export function extractUniqueElements(data: ComponentData[]): string[] {
  const uniqueElementsSet = new Set<string>();

  data.forEach(item => {
    if (item.assign) { 
      item.assign.forEach(element => {
        uniqueElementsSet.add(element);
      });
    }
  });

  return Array.from(uniqueElementsSet);
}
