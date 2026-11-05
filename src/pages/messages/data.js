import { getMessages } from '../../api/school';
import { resolvePageRequests } from '../resolvePageRequests';

export async function loadMessages({ token, sequence }) {
  return resolvePageRequests({ schoolMessages: getMessages(token, { sequence }) });
}
