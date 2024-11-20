import { useCollection, useDocument, useFirestore } from "vuefire";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import _isNil from "lodash/isNil";
import { v4 as uuidv4 } from "uuid";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { ref } from "vue";
import moment from "moment";

export const useMakruraStore = defineStore("makrura", () => {
  const db = useFirestore();
  const { data: items, pending } = useCollection(collection(db, "makrura"));
  const admin = useDocument(
    doc(db, "makrura", String("a732ca0a-abcc-4ddf-bc5a-30b31c1b4bc4 ")),
  );

  const busy = ref(false);

  const item = (): any => ({
    id: uuidv4(),
    created: moment().toDate(),
    owner: "",
    country: "",
    location: "",
    position: {
      latitude: "",
      longitude: "",
    },
    visit: false,
    image: "",
  });

  const save = async (item: any) => {
    try {
      busy.value = true;

      await setDoc(doc(db, "makrura", item.id), item);
    } catch (e) {
      console.error(e);
    } finally {
      busy.value = false;
    }
  };

  const update = async (item: Partial<any>) => {
    try {
      busy.value = true;
      if (item.id) {
        const reference = doc(db, "makrura", item.id);
        item.updated = moment().toDate();
        await updateDoc(reference, item as any);
      }
    } catch (e) {
      console.error(e);
    } finally {
      busy.value = false;
    }
  };

  const add = async () => {
    await save(item());
  };

  const remove = async (item: Partial<any>) => {
    try {
      busy.value = true;
      if (item.id) {
        const reference = doc(db, "makrura", item.id);
        await deleteDoc(reference);
      }
    } catch (e) {
      console.error(e);
    } finally {
      busy.value = false;
    }
  };

  const claim = async (secret: string) => {
    if (
      !_isNil(admin.value) &&
      secret === admin.value.secret &&
      secret.length > 0
    ) {
      try {
        data.value.admin = true;
      } catch (error) {
        return false;
      }
      return true;
    }
    return false;
  };

  const canEdit = (): boolean => data.value.admin ?? false;

  const data = useStorage("vivre/makrua", {
    new: item(),
    active: {},
    admin: false,
  } as any);

  const isvalid = (m: any) =>
    m.position?.longitude && m.position?.latitude && m.country;

  return {
    items,
    pending,
    data,
    save,
    add,
    update,
    remove,
    busy,
    canEdit,
    claim,
    isvalid,
  };
});
