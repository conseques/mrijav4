import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const REPORT_DOC_ID = 'main';
const REPORTS_COLLECTION = 'reports';

export const getReportData = async () => {
  try {
    const docRef = doc(db, REPORTS_COLLECTION, REPORT_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Default data if none exists
      const defaultData = {
        totalAmountRaised: 35450,
        goalAmount: 150000,
        livesImpacted: 850,
        activeProjects: 5,
        updatedAt: new Date().toISOString(),
        distribution: {
          militaryAid: 21270, // 60%
          humanitarianAid: 8863, // 25%
          otherOrgsSupport: 3545, // 10%
          other: 1772 // 5%
        },
        recentAllocations: [
          {
            id: '1',
            project: "Slava Ukraini!",
            categoryKey: "militaryAidTitle",
            date: "Oct 24, 2023",
            amount: "13,450.00"
          },
          {
            id: '2',
            project: "Ukrainian Freedom Convoys",
            categoryKey: "otherOrgsTitle",
            date: "Oct 22, 2023",
            amount: "10,000.00"
          }
        ]
      };
      await setDoc(docRef, defaultData);
      return defaultData;
    }
  } catch (error) {
    console.error("Error fetching report data:", error);
    throw error;
  }
};

export const updateReportData = async (data) => {
  try {
    const docRef = doc(db, REPORTS_COLLECTION, REPORT_DOC_ID);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating report data:", error);
    throw error;
  }
};
