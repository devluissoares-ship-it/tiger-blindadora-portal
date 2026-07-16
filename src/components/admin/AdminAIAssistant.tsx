// Troque isso:
// import { AIAssistant } from '@/components/cliente/AIAssistant';

// Por isso (importando o default):
import AIAssistant from '@/components/cliente/AIAssistant'; 

import { Cliente } from '@/types/cliente';

export const AdminAIAssistant = ({ cliente }: { cliente: Cliente }) => {
  return <AIAssistant cliente={cliente} isUserAdmin={true} />;
};