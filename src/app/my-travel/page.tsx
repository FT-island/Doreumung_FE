'use client';

import TravelCard from '@/components/my-travel/TravelCard';
import { useGetTraveRoutesQuery } from '@/api/travelRouteApi';
import LoadingSpinner from '@/components/common/loadingSpinner/LoadingSpinner';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Page = () => {
  const { data: travelRoute, isLoading, error } = useGetTraveRoutesQuery({ page: 1, size: 5 });
  const userData = useSelector((state: RootState) => state.user.user);
  if (isLoading)
    return (
      <div>
        <LoadingSpinner />;
      </div>
    );

  if (error || !travelRoute) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <div className="flex flex-col items-center pt-4 overflow-x-hidden pb-10">
      <p className="py-16 text-3xl">{userData?.nickname}님의 저장 경로</p>{' '}
      {/* 사용자 이름 받아와서 적용 */}
      <div className="flex flex-col w-full max-w-[768px] px-4 mx-auto gap-8 md:pb-10">
        {travelRoute.travel_list.map(route => (
          <div key={route.travel_route_id} className="flex-shrink-0">
            <TravelCard
              title={route.title}
              region={route.config.regions}
              placeArray={route.travel_route} // travel_route 사용
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
