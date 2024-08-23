import {storage} from '@utils/secure-storage';
import {UserContact} from '@screens/Operations/PayWithPhone/components/contactItem';

const KEY = '@recentContacts';
const getRecentContacts = () => storage.getString(KEY);

export default {
  removeAll: () => storage.set(KEY, JSON.stringify([])),
  getAll: () => {
    const recentContacts = getRecentContacts();
    return recentContacts ? JSON.parse(recentContacts) : [];
  },
  add: (userContact: UserContact) => {
    const recentContacts = getRecentContacts();
    const oldRecentContacts = recentContacts ? JSON.parse(recentContacts) : [];
    const contacsMap = new Map();
    for (const user of oldRecentContacts) {
      contacsMap.set(user.recordID, user);
    }
    const newRecentContacts = [];
    if (oldRecentContacts.length === 3) {
      oldRecentContacts.pop();
    }
    if (contacsMap.has(userContact.recordID)) {
      contacsMap.delete(userContact.recordID);
      newRecentContacts.push(userContact, ...Array.from(contacsMap.values()));
    } else {
      newRecentContacts.push(userContact, ...oldRecentContacts);
    }
    storage.set(KEY, JSON.stringify(newRecentContacts));
  },
};
