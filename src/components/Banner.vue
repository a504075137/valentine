<template>
  <div class="ban-wrapper">
    <!-- <div class="banner">
      <swiper :options="swiperOption" class="swiper">
        <swiper-slide>
          <div
            class="banner-img"
            :style="{backgroundImage:`url(${require(`@imgs/banner_2.png`)})`}"
          ></div>
        </swiper-slide>
        <swiper-slide>
          <div class="banner-img"></div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>-->
    <div class="banner">
      <div class="swiper-container banner">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div
              class="banner-img"
              :style="{backgroundImage:`url(${require(`@imgs/banner_2.png`)})`}"
            ></div>
          </div>
<!--          <div class="swiper-slide">-->
<!--            <div class="banner-img"></div>-->
<!--          </div>-->
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import { swiper, swiperSlide } from "vue-awesome-swiper";
import Swiper from 'swiper';
import "swiper/css/swiper.min.css";
export default {
    name:"banner",
    data() {
        return {
            swiperOption: {
                pagination: {
                    el: ".swiper-pagination"
                },
                loop:true,
                autoplay:true
            },
        };
    },
    components:{
        // swiper,
        // swiperSlide
    },
    mounted(){
        var myBannerSwiper = new Swiper ('.swiper-container.banner', {
            loop: true, // 循环模式选项
            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination',
            },
            autoplay: true,

        });
    }
};
</script>

<style lang="less">
.ban-wrapper {
    .wh(6.98rem, 2.74rem);
  margin: 0.12rem auto 0;
  @media @wide {
    margin-top: 0.1rem;
  }
  > .banner {
    .wh(100%);
    // .bg-contain("banner_1.png");
    > .swiper-container.banner {
      .swiper-slide {
        .banner-img {
            border-radius: .15rem;
            .wh(6.98rem, 2.74rem);
          .bg-cover("banner_1.png");
        }
      }
      > .swiper-pagination {
        bottom: -3px;
        > .swiper-pagination-bullet {
          .wh(0.14rem);
          background-color: transparent;
          border: solid 1px #ffffff;
          &-active {
            opacity: 1;
            background-color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
