export enum STATUS_ENUM {
  'in_progress' = 'En cours',
  'done' = 'Valider',
}
export const STATUS: { [k: string]: string } = {
  in_progress: 'En cours',
  done: 'Complete',
  answered: 'Répondu',
  unanswered: 'Non répondu',
};
