'use client';

import { useState } from 'react';
import TravelCard from '@/components/my-travel/TravelCard';
import { useGetTraveRoutesQuery } from '@/api/travelRouteApi';
import LoadingSpinner from '@/components/common/loadingSpinner/LoadingSpinner';
import Pagination from '@/components/common/pagination/Pagination';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Link from 'next/link';

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const {
    data: travelRoute,
    isLoading,
    error,
  } = useGetTraveRoutesQuery({
    page: currentPage,
    size: itemsPerPage,
  });
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
      <div className="flex flex-col w-full max-w-[768px] mx-auto gap-8 md:pb-10">
        {travelRoute.travel_list.map(route => (
          <Link
            key={route.travel_route_id}
            href={`my-travel/${route.travel_route_id}`}
            className="flex-shrink-0"
          >
            <TravelCard
              title={route.title}
              theme={route.config.themes}
              region={route.config.regions}
              placeArray={route.travel_route}
              travel_route_id={route.travel_route_id}
            />
          </Link>
        ))}
      </div>
      <Pagination
        totalResults={travelRoute.total_travel_routes}
        currentPage={currentPage}
        setPage={setCurrentPage}
        perPage={itemsPerPage}
      />
    </div>
  );
};

export default Page;
