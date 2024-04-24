using Microsoft.Extensions.Caching.Memory;

namespace FinancePersonal.Server.Helper
{
    public static class CacheHelper
    {
        public static MemoryCacheEntryOptions GetDefaultCacheOptions()
        {
            return new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromSeconds(240
                ))
                .SetAbsoluteExpiration(TimeSpan.FromHours(1))
                .SetPriority(CacheItemPriority.Normal)
                .SetSize(1);
        }
    }
}
