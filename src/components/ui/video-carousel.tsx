"use client";

import * as React from "react";

import { FaChevronLeft, FaChevronRight, FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

import { ApiResponse, Files, Parameter } from "@/types";
import { parametersApi } from "@/utils";

export const VideoCarousel = () => {
  const [videos, setVideos] = React.useState<Files[]>([]);

  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [playingVideo, setPlayingVideo] = React.useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = React.useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [dragStart, setDragStart] = React.useState<number>(0);
  const [dragOffset, setDragOffset] = React.useState<number>(0);
  const [pausedVideos, setPausedVideos] = React.useState<Set<string>>(new Set());

  const { data: parameter, isLoading } = parametersApi.useGetParameters<ApiResponse<Parameter>>({ key: ["parameters"] });

  const videoRefs = React.useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const goToSlide = React.useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  }, [videos.length]);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  }, [videos.length]);

  const handlePlayPause = (videoFilename: string) => {
    const video = videoRefs.current[videoFilename];
    if (!video) return;

    if (playingVideo === videoFilename) {
      video.pause();
      setPlayingVideo(null);
      setPausedVideos((prev) => new Set(prev).add(videoFilename));
    } else {
      Object.values(videoRefs.current).forEach((v) => v?.pause());
      video.play();
      setPlayingVideo(videoFilename);
      setPausedVideos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(videoFilename);
        return newSet;
      });
    }
  };

  const handleMuteToggle = (videoFilename: string) => {
    const video = videoRefs.current[videoFilename];
    if (!video) return;

    const newMutedVideos = new Set(mutedVideos);
    if (mutedVideos.has(videoFilename)) {
      newMutedVideos.delete(videoFilename);
      video.muted = false;
    } else {
      newMutedVideos.add(videoFilename);
      video.muted = true;
    }
    setMutedVideos(newMutedVideos);
  };

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStart(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const offset = clientX - dragStart;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    if (dragOffset > threshold) {
      prevSlide();
    } else if (dragOffset < -threshold) {
      nextSlide();
    }

    setDragOffset(0);
  };

  const currentVideo = videos[currentIndex];
  const isCurrentVideoPlaying = currentVideo && playingVideo === currentVideo.filename;

  React.useEffect(() => {
    if (parameter && parameter.data) {
      setVideos(parameter.data.video);
    }
  }, [parameter]);

  React.useEffect(() => {
    if (videos.length === 0) return;

    Object.values(videoRefs.current).forEach((v) => v?.pause());
    setPlayingVideo(null);

    const currentVideo = videos[currentIndex];
    if (currentVideo) {
      const videoElement = videoRefs.current[currentVideo.filename];

      if (videoElement && !pausedVideos.has(currentVideo.filename)) {
        const timer = setTimeout(() => {
          videoElement
            .play()
            .then(() => {
              setPlayingVideo(currentVideo.filename);
            })
            .catch((error) => {
              setPlayingVideo(error);
            });
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, videos, pausedVideos]);

  React.useEffect(() => {
    videoRefs.current = {};
    setPausedVideos(new Set());
  }, [videos]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <div
        className="relative h-full overflow-hidden cursor-grab active:cursor-grabbing rounded-lg"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div className="flex h-full transition-transform duration-500 ease-out" style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))` }}>
          {videos.map((video, index) => (
            <div key={video.filename} className="flex-shrink-0 w-full h-full relative">
              <div className="absolute inset-0 bg-dark/20"></div>

              <video
                ref={(el) => {
                  videoRefs.current[video.filename] = el;
                }}
                className="w-full h-full object-cover"
                preload="metadata"
                onEnded={() => setPlayingVideo(null)}
                onLoadStart={() => {
                  if (videoRefs.current[video.filename]) {
                    videoRefs.current[video.filename]!.pause();
                  }
                }}
              >
                <source src={video.url} type="video/mp4" />
              </video>

              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => handlePlayPause(video.filename)}
                  className={`bg-light/90 hover:bg-light text-gray rounded-full p-6 transition-all duration-300 hover:scale-110 ${
                    isCurrentVideoPlaying && index === currentIndex ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {playingVideo === video.filename ? <FaPause className="size-8" /> : <FaPlay className="size-8" />}
                </button>
              </div>

              <div className="absolute top-6 right-6 flex gap-3">
                <button onClick={() => handleMuteToggle(video.filename)} className="bg-dark/60 hover:bg-dark/80 text-light p-3 rounded-full transition-all duration-200 backdrop-blur-sm">
                  {mutedVideos.has(video.filename) ? <FaVolumeMute className="size-6" /> : <FaVolumeUp className="size-6" />}
                </button>
              </div>

              {playingVideo === video.filename && (
                <div className="absolute top-6 left-6">
                  <div className="flex items-center gap-2 bg-red-600 text-light text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                    <div className="w-2 h-2 bg-light rounded-full animate-pulse"></div>
                    PLAYING
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 bg-dark/50 hover:bg-dark/70 text-light p-4 rounded-full transition-all duration-200 backdrop-blur-sm z-10">
        <FaChevronLeft className="size-8" />
      </button>

      <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 bg-dark/50 hover:bg-dark/70 text-light p-4 rounded-full transition-all duration-200 backdrop-blur-sm z-10">
        <FaChevronRight className="size-8" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-light scale-125" : "bg-light/40 hover:bg-light/60"}`}
          />
        ))}
      </div>
    </>
  );
};
