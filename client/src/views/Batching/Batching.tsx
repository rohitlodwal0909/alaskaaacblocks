import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';

import { useSelector } from 'react-redux';
import BatchingdateTable from './BatchingComponent.tsx/BatchingdateTable';
const Batching = () => {
      const logindata = useSelector((state: any) => state.authentication?.logindata);
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Batching ", to: "/" }]}
        title="Batching"/>
        <CardBox>
          <div className="flex justify-end my-1">
          </div>
        <BatchingdateTable logindata={logindata}/>
       </CardBox>
        </>
  )
}

export default Batching