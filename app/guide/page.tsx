import { AppShell } from '@/components/Layout/AppShell';
import Link from 'next/link';

export const metadata = {
  title: 'User Guide - Free AI Creation',
  description: 'Comprehensive guide for using Free AI Creation\'s AI video, image generation, and upscaling tools.',
};

export default function GuidePage() {
  return (
    <AppShell>
      <div className="min-h-screen bg-[#050508] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Hero Section */}
          <section className="mb-12 border-b border-white/10 pb-8">
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              Free AI Creation User Guide
            </h1>
            <p className="text-lg text-gray-300">
              Free AI Creation is a free AI media production platform accessible to everyone. 
              You can instantly start creating with AI video, image generation, and upscaling 
              tools without any sign-up required. This guide provides detailed instructions 
              on how to effectively use all features of the service.
            </p>
          </section>

          {/* Table of Contents */}
          <nav className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Table of Contents</h2>
            <ol className="space-y-2 text-gray-300">
              <li>
                <a href="#introduction" className="hover:text-purple-400 transition-colors">
                  1. Service Introduction
                </a>
              </li>
              <li>
                <a href="#getting-started" className="hover:text-purple-400 transition-colors">
                  2. Getting Started – Basic Usage Flow
                </a>
                <ol className="ml-6 mt-2 space-y-1 text-sm">
                  <li>
                    <a href="#video-studio" className="hover:text-purple-400 transition-colors">
                      2.1. AI Video Studio Guide
                    </a>
                  </li>
                  <li>
                    <a href="#image-generation" className="hover:text-purple-400 transition-colors">
                      2.2. AI Image Generation Guide
                    </a>
                  </li>
                  <li>
                    <a href="#upscaling" className="hover:text-purple-400 transition-colors">
                      2.3. AI Upscaling Guide
                    </a>
                  </li>
                </ol>
              </li>
              <li>
                <a href="#watermark-ads" className="hover:text-purple-400 transition-colors">
                  3. Watermarks and Advertising Information
                </a>
              </li>
              <li>
                <a href="#content-copyright" className="hover:text-purple-400 transition-colors">
                  4. Content & Copyright / Usage Guidelines
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-purple-400 transition-colors">
                  5. Frequently Asked Questions (FAQ)
                </a>
              </li>
              <li>
                <a href="#troubleshooting" className="hover:text-purple-400 transition-colors">
                  6. Troubleshooting
                </a>
              </li>
            </ol>
          </nav>

          {/* Main Content */}
          <article className="space-y-12 text-gray-300">
            {/* Section 1: Introduction */}
            <section id="introduction">
              <h2 className="mb-6 text-3xl font-bold text-white">1. Service Introduction</h2>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-300">
                  What is Free AI Creation?
                </h3>
                <p className="leading-relaxed">
                  Free AI Creation is a web-based creative platform that allows anyone to easily 
                  generate and edit videos and images using cutting-edge artificial intelligence 
                  technology. Through the Replicate platform, we provide access to proven AI 
                  models such as Seedance Lite, Stable Diffusion, and Real-ESRGAN. You can 
                  create professional-quality content directly in your browser without complex 
                  installation processes or expensive hardware.
                </p>

                <h3 className="mt-6 text-xl font-semibold text-purple-300">
                  What Sets Us Apart from Other AI Tools
                </h3>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>
                    <strong className="text-white">Completely Free:</strong> All features are 
                    provided free of charge. There are no premium plans or hidden costs, making 
                    it accessible to students, individual creators, and hobbyists without any 
                    financial burden.
                  </li>
                  <li>
                    <strong className="text-white">No Login Required:</strong> There's no sign-up 
                    or login process whatsoever. You can start working immediately upon visiting 
                    the site, with no concerns about entering personal information. Projects are 
                    automatically saved in your browser's local storage.
                  </li>
                  <li>
                    <strong className="text-white">Ad-Supported Operation:</strong> We cover 
                    server costs and AI model API expenses through Google AdSense banner ads and 
                    rewarded ads. We don't engage in excessive user tracking or data selling, and 
                    operate in a transparent and ethical manner.
                  </li>
                  <li>
                    <strong className="text-white">Creator-Friendly:</strong> Perfect for various 
                    uses including YouTube thumbnails, social media content, and portfolio creation. 
                    Through the watermark removal feature, you can obtain high-quality final results.
                  </li>
                  <li>
                    <strong className="text-white">Latest AI Models:</strong> We continuously 
                    update with the latest industry-proven models, providing production-ready 
                    quality results rather than just demos.
                  </li>
                </ul>

                <h3 className="mt-6 text-xl font-semibold text-purple-300">
                  Why We Use Advertising
                </h3>
                <p className="leading-relaxed">
                  Running AI models incurs significant computing costs. Every time you generate 
                  a video with Seedance Lite or create an image with Stable Diffusion through 
                  the Replicate API, actual server costs are charged. Free AI Creation doesn't 
                  pass these costs onto users, but instead maintains the service through Google 
                  AdSense banner ads and optional rewarded ads. When you watch ads, you can 
                  download clean versions of your results without watermarks. This is our choice 
                  to balance service sustainability with user experience. We don't excessively 
                  collect personal information or sell it to third parties, following only 
                  Google AdSense's standard policies.
                </p>
              </div>
            </section>

            {/* Section 2: Getting Started */}
            <section id="getting-started">
              <h2 className="mb-6 text-3xl font-bold text-white">
                2. Getting Started – Basic Usage Flow
              </h2>
              
              <p className="mb-8 leading-relaxed">
                Free AI Creation provides three core tools. Each tool can be used independently, 
                and you can choose based on your purpose. Below are detailed usage instructions 
                for each tool.
              </p>

              {/* AI Video Studio */}
              <div id="video-studio" className="mb-10">
                <h3 className="mb-4 text-2xl font-semibold text-purple-300">
                  2.1. AI Video Studio Guide
                </h3>
                
                <p className="mb-4 leading-relaxed">
                  The AI Video Studio uses the Seedance Lite model to generate short video clips 
                  from text prompts. You can create videos with cinematic camera movements and 
                  natural motion, and manage multiple clips in a timeline as a single project.
                </p>

                <h4 className="mb-3 text-lg font-semibold text-white">Step-by-Step Instructions:</h4>
                <ol className="ml-6 space-y-3 list-decimal">
                  <li>
                    <strong className="text-white">Add Clip:</strong> Click the "Add Clip" button 
                    at the top of the page to add a new clip to the timeline. Each clip has 
                    independent settings, and you can add as many clips as you need.
                  </li>
                  <li>
                    <strong className="text-white">Enter Prompt:</strong> Enter a description of 
                    the video you want to create in English. For example, writing specifically like 
                    "a woman walking through a park in autumn" will yield better results. It's 
                    best to include the scene, subject, action, and atmosphere in your prompt.
                  </li>
                  <li>
                    <strong className="text-white">Select Duration and Resolution:</strong> You 
                    can set the video duration between 2 and 5 seconds. Currently fixed at 480p 
                    resolution, and aspect ratio can be chosen from 16:9 (landscape), 9:16 
                    (portrait), or 1:1 (square).
                  </li>
                  <li>
                    <strong className="text-white">Advanced Options (Optional):</strong>
                    <ul className="ml-6 mt-2 space-y-1 list-disc">
                      <li>
                        <strong>Seed:</strong> Use when you want to reproduce the same result with 
                        identical prompts and settings. Fixing a number allows you to create 
                        multiple videos with consistent style.
                      </li>
                      <li>
                        <strong>Init Image:</strong> Upload a starting image to begin the video 
                        from that image. This is an Image-to-Video feature, useful for adding 
                        dynamic movement to static images.
                      </li>
                      <li>
                        <strong>Last Frame Image:</strong> Specify an image for the video's final 
                        frame. Can be used to naturally connect multiple clips.
                      </li>
                      <li>
                        <strong>Reference Images:</strong> Upload up to 4 reference images to 
                        generate videos that reference the style or composition of those images.
                      </li>
                      <li>
                        <strong>Camera Fixed:</strong> When checked, the camera stays fixed and 
                        only the subject moves. Unchecked creates dynamic videos with camera 
                        movement.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-white">Execute Generate:</strong> After completing all 
                    settings, click the "Generate" button. Video generation starts on the Replicate 
                    server, typically taking 30 seconds to 2 minutes. Progress is shown on the 
                    progress bar.
                  </li>
                  <li>
                    <strong className="text-white">Preview and Playback:</strong> Once generation 
                    is complete, the video displays in the preview panel. Use the play button to 
                    watch the video, or the fullscreen button to view larger. With multiple clips 
                    in the timeline, you can use "Play All" for sequential playback.
                  </li>
                  <li>
                    <strong className="text-white">Download:</strong> Generated videos include 
                    the Free AI Creation watermark by default. Watermarked versions can be 
                    downloaded immediately, and if you want a watermark-free version, click the 
                    "Watch Ad to Remove Watermark" button to watch a rewarded ad before downloading.
                  </li>
                </ol>

                <h4 className="mb-3 mt-6 text-lg font-semibold text-white">
                  Example Prompts That Work Well:
                </h4>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>
                    <code className="rounded bg-white/10 px-2 py-1 text-purple-300">
                      "a young woman walking through a beautiful autumn park, golden leaves 
                      falling, cinematic lighting"
                    </code>
                    <span className="ml-2 text-sm">
                      - Woman walking in autumn park, cinematic atmosphere
                    </span>
                  </li>
                  <li>
                    <code className="rounded bg-white/10 px-2 py-1 text-purple-300">
                      "blue sports car driving fast on a mountain road at sunset, dramatic sky"
                    </code>
                    <span className="ml-2 text-sm">
                      - Sports car on mountain road at sunset, dramatic composition
                    </span>
                  </li>
                  <li>
                    <code className="rounded bg-white/10 px-2 py-1 text-purple-300">
                      "ocean waves crashing on rocks, slow motion, peaceful atmosphere"
                    </code>
                    <span className="ml-2 text-sm">
                      - Waves crashing on rocks, slow motion, peaceful mood
                    </span>
                  </li>
                  <li>
                    <code className="rounded bg-white/10 px-2 py-1 text-purple-300">
                      "cyberpunk city street at night, neon lights, rain reflections, 
                      futuristic"
                    </code>
                    <span className="ml-2 text-sm">
                      - Cyberpunk-style night street with neon lights and rain reflections
                    </span>
                  </li>
                </ul>

                <div className="mt-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                  <p className="text-sm">
                    <strong className="text-purple-300">💡 Tip:</strong> Write prompts as 
                    specifically as possible, but keep them concise (within 50 words). Adding 
                    keywords like "cinematic", "dramatic lighting", "high quality" can yield 
                    better results.
                  </p>
                </div>
              </div>

              {/* AI Image Generation */}
              <div id="image-generation" className="mb-10">
                <h3 className="mb-4 text-2xl font-semibold text-purple-300">
                  2.2. AI Image Generation Guide
                </h3>
                
                <p className="mb-4 leading-relaxed">
                  The AI Image Lab uses the Stable Diffusion model to generate high-quality 
                  images from text descriptions. You can create various styles of results 
                  including concept art, thumbnails, illustrations, and photorealistic images, 
                  with fine-tuned settings to achieve your desired outcome.
                </p>

                <h4 className="mb-3 text-lg font-semibold text-white">Step-by-Step Instructions:</h4>
                <ol className="ml-6 space-y-3 list-decimal">
                  <li>
                    <strong className="text-white">Enter Prompt:</strong> Describe the image you 
                    want to create in detail in English. For example, "a magical forest with 
                    glowing mushrooms, moonlight, fantasy art style" - including subject, 
                    background, lighting, and style works best. Korean keywords are partially 
                    supported, but English provides more accurate results.
                  </li>
                  <li>
                    <strong className="text-white">Select Resolution:</strong> Choose your desired 
                    image size. Common options include 512×512 (square), 768×512 (landscape), 
                    512×768 (portrait), with higher resolutions taking longer but providing more 
                    detail. Recommended 1:1 for social media content, 16:9 for YouTube thumbnails.
                  </li>
                  <li>
                    <strong className="text-white">Choose Style:</strong> Select your desired art 
                    style.
                    <ul className="ml-6 mt-2 space-y-1 list-disc">
                      <li>
                        <strong>Photo:</strong> Generates photorealistic images. Suitable for 
                        portraits, landscapes, and product photography.
                      </li>
                      <li>
                        <strong>Illustration:</strong> Digital illustration style with clean lines 
                        and clear color separation.
                      </li>
                      <li>
                        <strong>Anime:</strong> Generates Japanese animation-style images. 
                        Suitable for character design and fan art.
                      </li>
                      <li>
                        <strong>Painting:</strong> Generates in painting styles like oil or 
                        watercolor. Use when artistic atmosphere is needed.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-white">Advanced Options (Optional):</strong>
                    <ul className="ml-6 mt-2 space-y-2 list-disc">
                      <li>
                        <strong>Seed:</strong> Entering a specific number allows you to reproduce 
                        identical results. Left empty generates randomly. Record the seed value 
                        when you get a good result to create similar style variations later.
                      </li>
                      <li>
                        <strong>Guidance Scale (CFG Scale):</strong> Determines how strictly to 
                        follow the prompt. Lower values (5-7) allow creative, free interpretation, 
                        while higher values (10-15) produce results faithful to the prompt. 
                        Default is usually 7-7.5.
                      </li>
                      <li>
                        <strong>Number of Outputs:</strong> Select how many images to generate 
                        at once. Multiple generations allow comparison of variations, but increase 
                        generation time.
                      </li>
                      <li>
                        <strong>Inference Steps:</strong> Number of refinement steps for the image. 
                        20-50 is typical, with higher values improving quality but taking longer. 
                        25-30 is the balance point between quality and speed.
                      </li>
                      <li>
                        <strong>Negative Prompt:</strong> Enter elements to exclude from the image. 
                        For example, writing "blurry, low quality, distorted, ugly" attempts to 
                        avoid those characteristics. For portraits, adding "extra fingers, deformed 
                        hands" can reduce hand-drawing errors.
                      </li>
                      <li>
                        <strong>Scheduler:</strong> Choose the sampling algorithm. Options include 
                        K_EULER, DPM++, DDIM, each producing subtly different texture and style. 
                        Start with the default (K_EULER) and experiment with others as you become 
                        familiar.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-white">Execute Generate:</strong> After completing 
                    settings, click the "Generate" button to start Stable Diffusion image 
                    generation. Typically takes 10-30 seconds, varying by resolution and steps.
                  </li>
                  <li>
                    <strong className="text-white">View and Manage Results:</strong> Generated 
                    images display prominently in the main preview area and are saved as thumbnails 
                    in the history panel. Click history to review previously created images, with 
                    prompt information also saved.
                  </li>
                  <li>
                    <strong className="text-white">Download:</strong> Watermarked versions can be 
                    downloaded immediately. For high-quality watermark-free versions, click "Watch 
                    Ad to Remove Watermark" to watch a rewarded ad before downloading.
                  </li>
                </ol>

                <h4 className="mb-3 mt-6 text-lg font-semibold text-white">
                  Tips for Better Results:
                </h4>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>
                    <strong className="text-white">Specific Descriptions:</strong> Instead of "a cat", 
                    write "a fluffy orange tabby cat sitting on a windowsill, soft natural light, 
                    cozy atmosphere".
                  </li>
                  <li>
                    <strong className="text-white">Add Quality Keywords:</strong> Adding keywords 
                    like "highly detailed", "8k", "professional photography", "trending on artstation" 
                    tends to generate more refined, polished images.
                  </li>
                  <li>
                    <strong className="text-white">Reference Artist Styles:</strong> Expressions 
                    like "in the style of Studio Ghibli", "painted by Monet" can mimic specific 
                    artists or studios. However, be cautious of copyright issues.
                  </li>
                  <li>
                    <strong className="text-white">Repeated Experimentation:</strong> AI image 
                    generation is probabilistic, producing different results each time with the 
                    same prompt. Keep trying until you get satisfactory results.
                  </li>
                  <li>
                    <strong className="text-white">Utilize Negative Prompts:</strong> If unwanted 
                    elements frequently appear, add them to the negative prompt. For example, if 
                    you want a simple background, adding "busy background, cluttered" to negative 
                    helps.
                  </li>
                </ul>

                <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                  <p className="text-sm text-yellow-200">
                    <strong>⚠️ Note:</strong> Stable Diffusion is trained on internet data, so 
                    sometimes unexpected or distorted images may be generated. Particularly, 
                    fingers, detailed facial structures, and text often have lower accuracy, so 
                    generate multiple times to select the best result.
                  </p>
                </div>
              </div>

              {/* AI Upscaling */}
              <div id="upscaling" className="mb-10">
                <h3 className="mb-4 text-2xl font-semibold text-purple-300">
                  2.3. AI Upscaling Guide
                </h3>
                
                <p className="mb-4 leading-relaxed">
                  The AI Upscaling tool uses the Real-ESRGAN model to enlarge low-resolution 
                  images to high resolution and restore fine details. You can sharpen old photos, 
                  small thumbnails, and compressed images, and it's also useful when you need 
                  high-resolution files for printing.
                </p>

                <h4 className="mb-3 text-lg font-semibold text-white">Step-by-Step Instructions:</h4>
                <ol className="ml-6 space-y-3 list-decimal">
                  <li>
                    <strong className="text-white">Upload Image:</strong> Click the "Upload Image" 
                    button or drag and drop to upload the image you want to upscale. Supports 
                    common image formats like JPG, PNG, WEBP, with a file size limit of 10MB.
                  </li>
                  <li>
                    <strong className="text-white">Select Scale:</strong> Choose the upscaling 
                    multiplier. 2x doubles width and height (4x total pixels), 4x quadruples 
                    width and height (16x total pixels). For example, a 512×512 image becomes 
                    2048×2048 at 4x. Higher multipliers take longer and results vary based on 
                    original image quality.
                  </li>
                  <li>
                    <strong className="text-white">Face Enhancement Option (Optional):</strong> 
                    Enabling Face Enhance specially corrects facial areas in portraits for more 
                    natural and sharp results. Recommended for profile photos or person-centric 
                    images.
                  </li>
                  <li>
                    <strong className="text-white">Execute Upscale:</strong> After completing 
                    settings, click the "Upscale" button. The Real-ESRGAN model analyzes and 
                    upscales the image, typically taking 20-60 seconds. Time increases with higher 
                    multipliers or larger original images.
                  </li>
                  <li>
                    <strong className="text-white">Before/After Comparison:</strong> Once upscaling 
                    completes, you can compare the original and upscaled images side by side. 
                    Zoom in to check detail improvement, and try different settings if unsatisfied.
                  </li>
                  <li>
                    <strong className="text-white">Download:</strong> Upscaled images include 
                    watermarks by default. To download watermark-free versions, click "Watch Ad 
                    to Remove Watermark" to watch a rewarded ad before downloading.
                  </li>
                </ol>

                <h4 className="mb-3 mt-6 text-lg font-semibold text-white">
                  Recommended Use Cases:
                </h4>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>
                    <strong className="text-white">Thumbnail Enlargement:</strong> Enlarge small 
                    thumbnails downloaded from YouTube or social media for use in presentations 
                    or posters.
                  </li>
                  <li>
                    <strong className="text-white">Profile Photo Enhancement:</strong> Upscale old 
                    profile photos or low-resolution selfies for sharpness. Works better with 
                    Face Enhance enabled.
                  </li>
                  <li>
                    <strong className="text-white">Print Image Preparation:</strong> Upscale 
                    web-sized images to high resolution for use in printed materials like posters, 
                    business cards, and flyers.
                  </li>
                  <li>
                    <strong className="text-white">AI-Generated Image Quality Improvement:</strong> 
                    Further upscaling images generated with Stable Diffusion can yield more 
                    refined details.
                  </li>
                  <li>
                    <strong className="text-white">Compression Artifact Removal:</strong> Can 
                    somewhat mitigate noise and blocking caused by JPEG compression.
                  </li>
                </ul>

                <div className="mt-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                  <p className="text-sm text-blue-200">
                    <strong>ℹ️ Data Retention Policy:</strong> Your uploaded original images and 
                    upscaling results are temporarily stored on the server for service operation, 
                    but are automatically deleted after a certain period (usually 24 hours). 
                    Free AI Creation does not permanently store or share user images with third 
                    parties.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Watermark & Ads */}
            <section id="watermark-ads">
              <h2 className="mb-6 text-3xl font-bold text-white">
                3. Watermarks and Advertising Information
              </h2>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-300">
                  Why Watermarks Are Included
                </h3>
                <p className="leading-relaxed">
                  All images and videos generated or processed by Free AI Creation include the 
                  "Free AI Creation" watermark by default. This watermark goes beyond simply 
                  indicating the service source - it's a crucial mechanism for maintaining a 
                  completely free service sustainably. Through watermarks, more people learn 
                  about this platform, which increases ad revenue and allows us to provide 
                  better service.
                </p>

                <p className="leading-relaxed">
                  Watermarks are applied using a "burn-in" method where they're directly 
                  composited into the image or video file on the server side. This isn't simply 
                  overlaying on the screen, but permanently embedding into the actual media file, 
                  so it cannot be bypassed with browser developer tools. For images, the Sharp 
                  library applies it at 90% opacity at the bottom center, and for videos, FFmpeg 
                  applies it small-sized at the bottom left.
                </p>

                <h3 className="mt-6 text-xl font-semibold text-purple-300">
                  "Watch Ad to Remove Watermark" Feature
                </h3>
                <p className="leading-relaxed">
                  If you want a clean version without watermarks, you can use the "Watch Ad to 
                  Remove Watermark" feature. This is a rewarded ad model where users can download 
                  the original file without watermarks in exchange for watching a short ad.
                </p>

                <h4 className="mb-3 mt-4 text-lg font-semibold text-white">How It Works:</h4>
                <ol className="ml-6 space-y-2 list-decimal">
                  <li>
                    When you generate an image or video, the watermarked version is used by 
                    default for preview and download.
                  </li>
                  <li>
                    Clicking the "Watch Ad to Remove Watermark" button launches a rewarded ad. 
                    (Currently a simulation version, with actual ad SDK integration planned.)
                  </li>
                  <li>
                    Upon completing the ad, the watermark-free original URL is activated for 
                    that image or video.
                  </li>
                  <li>
                    Preview and download then switch to the clean version, with the button 
                    displaying as "Watermark Removed".
                  </li>
                  <li>
                    Each media item independently manages its watermark removal state, so watching 
                    an ad for one image doesn't remove watermarks from others.
                  </li>
                </ol>

                <h3 className="mt-6 text-xl font-semibold text-purple-300">
                  Difference Between Banner Ads and Rewarded Ads
                </h3>
                <p className="leading-relaxed">
                  Free AI Creation uses two forms of advertising. First, Google AdSense banner 
                  ads are displayed fixed on the left and right sides of pages. These are 
                  naturally exposed while browsing pages, generating revenue just from clicks 
                  or views. Second, rewarded ads only run when users explicitly click "Watch Ad 
                  to Remove Watermark", providing immediate benefits (watermark removal) upon 
                  completion. This dual structure is a balanced approach that covers service 
                  operation costs while giving users choice.
                </p>

                <div className="mt-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                  <p className="text-sm">
                    <strong className="text-purple-300">💡 Note:</strong> If you use an ad 
                    blocker, banner ads won't display and rewarded ad features may be limited. 
                    For service sustainability, we'd appreciate it if you could add this site to 
                    your ad blocker's exception list.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Content & Copyright */}
            <section id="content-copyright">
              <h2 className="mb-6 text-3xl font-bold text-white">
                4. Content & Copyright / Usage Guidelines
              </h2>
              
              <div className="space-y-4">
                <p className="leading-relaxed">
                  The use and distribution of content created using Free AI Creation is the 
                  user's responsibility. AI models are trained on vast data collected from the 
                  internet and may sometimes generate results similar to copyrighted works, 
                  trademarks, or specific individuals' likeness. Special care is needed when 
                  using such results.
                </p>

                <h3 className="mt-6 text-xl font-semibold text-purple-300">
                  Copyright and Trademark Considerations
                </h3>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>
                    <strong className="text-white">No Copying Others' Works:</strong> Images 
                    generated by explicitly entering specific characters, brand logos, or famous 
                    work names in prompts may constitute copyright infringement. For example, 
                    using keywords like "Mickey Mouse", "Marvel characters", "Gucci logo" can 
                    lead to legal issues.
                  </li>
                  <li>
                    <strong className="text-white">Respect Right of Publicity:</strong> Images 
                    generated by entering real people's names in prompts may infringe on their 
                    right of publicity. Unauthorized use or manipulation of celebrities, 
                    politicians, or specific individuals' faces can result in legal liability.
                  </li>
                  <li>
                    <strong className="text-white">Verify Before Commercial Use:</strong> You 
                    must check the license policies of underlying models like Stable Diffusion 
                    and Seedance Lite. Generally free for personal and non-commercial purposes, 
                    but commercial use (sales, advertising, branding, etc.) requires compliance 
                    with each model's license and Replicate's terms of service.
                  </li>
                  <li>
                    <strong className="text-white">Source Attribution Recommended:</strong> 
                    Although watermarks can be removed, it's ethically good to indicate that 
                    content is AI-generated. Especially when posting on social media or portfolios, 
                    we recommend adding notes like "AI generated" or "Created with Free AI 
                    Creation".
                  </li>
                </ul>

                <h3 className="mt-6 text-xl font-semibold text-purple-300">
                  Prohibited Content and Usage Restrictions
                </h3>
                <p className="leading-relaxed">
                  Free AI Creation should be used for creative and positive purposes and cannot 
                  be used for the following:
                </p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>
                    <strong className="text-white">Adult Content:</strong> Creating or distributing 
                    pornography, explicit sexual content, or inappropriate content targeting 
                    minors is strictly prohibited.
                  </li>
                  <li>
                    <strong className="text-white">Violence and Hate Speech:</strong> Generating 
                    images or videos that incite discrimination, hatred, or violence against 
                    specific groups is prohibited.
                  </li>
                  <li>
                    <strong className="text-white">Deepfakes and Misinformation:</strong> Creating 
                    manipulated content to impersonate real people or spread false information 
                    is illegal and can result in serious legal liability.
                  </li>
                  <li>
                    <strong className="text-white">Illegal Activities:</strong> Use for content 
                    that aids in planning or executing criminal acts, or for purposes of 
                    circumventing laws is prohibited.
                  </li>
                </ul>

                <h3 className="mt-6 text-xl font-semibold text-purple-300">
                  User Responsibility and Disclaimer
                </h3>
                <p className="leading-relaxed">
                  Free AI Creation is merely a platform providing tools and bears no responsibility 
                  for the content users generate or its consequences. All legal responsibility 
                  for using and distributing uploaded images, entered prompts, and generated 
                  results rests with the user. If we receive reports that generated content 
                  infringes third-party rights, that content may be deleted, and in cases of 
                  serious violations, service access may be restricted.
                </p>

                <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <p className="text-sm text-red-200">
                    <strong>⚠️ Important:</strong> The legal status of AI-generated content 
                    varies by country and region, and related regulations continue to evolve. 
                    Especially for commercial use or sensitive topics, please seek legal expert 
                    advice.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: FAQ */}
            <section id="faq">
              <h2 className="mb-6 text-3xl font-bold text-white">
                5. Frequently Asked Questions (FAQ)
              </h2>
              
              <div className="space-y-6">
                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-2 text-lg font-semibold text-purple-300">
                    Q1. Is there a daily limit on generations?
                  </h3>
                  <p className="text-gray-300">
                    Currently, Free AI Creation doesn't impose clear limits on generation count. 
                    However, temporary rate limiting may apply if you send too many consecutive 
                    requests in a very short time to manage server load and costs. Within normal 
                    usage ranges, you can use it freely without restrictions.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-2 text-lg font-semibold text-purple-300">
                    Q2. Must I watch ads to use the service?
                  </h3>
                  <p className="text-gray-300">
                    No, you can use all features without watching ads. Banner ads are automatically 
                    displayed on the left and right sides of pages, but there's no obligation to 
                    click or watch them. Rewarded ads ("Watch Ad to Remove Watermark") are only 
                    optionally viewed when you want watermark-free versions, not mandatory. 
                    Watermarked versions can be downloaded for free anytime.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-2 text-lg font-semibold text-purple-300">
                    Q3. Why is there no login feature?
                  </h3>
                  <p className="text-gray-300">
                    Free AI Creation prioritizes accessibility. Sign-up and login processes act 
                    as entry barriers for many users and create concerns about entering personal 
                    information. We maintain a "anyone can use immediately" philosophy by operating 
                    as a no-login service, with project data automatically saved in browser local 
                    storage. While we plan to add cloud sync features in the future, login will 
                    remain optional.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-2 text-lg font-semibold text-purple-300">
                    Q4. What should I do if I'm not satisfied with results?
                  </h3>
                  <p className="text-gray-300">
                    AI generation is probabilistic, producing different results each time. Try 
                    these methods: (1) Make prompts more specific. (2) Change the seed value or 
                    leave it empty to try various iterations. (3) Generate multiple images/clips 
                    and select the best one. (4) Adjust advanced settings like Guidance Scale or 
                    Inference Steps. (5) Add reference images or style keywords for clearer 
                    direction. Typically, 3-5 attempts yield satisfactory results.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-2 text-lg font-semibold text-purple-300">
                    Q5. Can I use generated content commercially?
                  </h3>
                  <p className="text-gray-300">
                    This depends on the underlying AI model's license policies. Stable Diffusion 
                    generally allows commercial use, but certain versions or fine-tuned models may 
                    have restrictions. Seedance Lite and Real-ESRGAN each have their own licenses 
                    to verify. Please review Replicate's terms of service and each model's license 
                    page before use. Additionally, ensuring generated content doesn't infringe 
                    others' copyrights or rights of publicity is the user's responsibility.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-2 text-lg font-semibold text-purple-300">
                    Q6. How long is generated data stored on servers?
                  </h3>
                  <p className="text-gray-300">
                    Free AI Creation respects user privacy. Generated images or videos are 
                    temporarily stored on servers but are automatically deleted within 24-48 hours. 
                    Project metadata (prompts, settings, etc.) is only saved in browser local 
                    storage and not transmitted to servers. Uploaded images (for upscaling, etc.) 
                    are also deleted shortly after processing. We don't retain, analyze, or sell 
                    user data long-term.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-2 text-lg font-semibold text-purple-300">
                    Q7. Can I use it on mobile browsers?
                  </h3>
                  <p className="text-gray-300">
                    Yes, Free AI Creation is built with responsive design and works on mobile 
                    browsers. However, since AI model generation is server-processed, data 
                    consumption can be high when using mobile data. Also, some UI elements may 
                    be scaled or rearranged on small screens, so desktop or tablet use is 
                    recommended when possible. Supports major mobile browsers like iOS Safari 
                    and Android Chrome.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-2 text-lg font-semibold text-purple-300">
                    Q8. What should I do if errors occur or generation stops?
                  </h3>
                  <p className="text-gray-300">
                    Occasionally, errors may occur due to Replicate API server load or temporary 
                    network issues. In this case: (1) Refresh the page and try again. (2) Check 
                    browser console logs for specific error messages. (3) Test in a different 
                    browser or incognito mode. (4) Simplify the prompt or reduce resolution. 
                    (5) Temporarily disable ad blockers or VPN. If issues persist, try again 
                    after some time.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-2 text-lg font-semibold text-purple-300">
                    Q9. Are non-English prompts supported?
                  </h3>
                  <p className="text-gray-300">
                    Currently, Stable Diffusion and Seedance Lite models are primarily trained 
                    on English data, so English prompts provide the most accurate results. 
                    Non-English prompts can be entered but the model may not properly understand 
                    intent or produce unexpected results. If possible, we recommend translating 
                    prompts to English using tools like Google Translate. We plan to integrate 
                    multilingual support models when they become available.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-2 text-lg font-semibold text-purple-300">
                    Q10. Can I backup or export project data?
                  </h3>
                  <p className="text-gray-300">
                    Currently, project data is auto-saved in browser local storage, so clearing 
                    browser cache or accessing from another device means you can't view previous 
                    data. We recommend downloading generated images or videos separately to 
                    preserve important projects. Future updates will add project export/import 
                    and cloud sync features, so stay tuned.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Troubleshooting */}
            <section id="troubleshooting">
              <h2 className="mb-6 text-3xl font-bold text-white">
                6. Troubleshooting
              </h2>
              
              <div className="space-y-4">
                <p className="leading-relaxed">
                  Here are common troubleshooting methods to reference when encountering issues 
                  with Free AI Creation. Most problems relate to browser settings or network 
                  status and can be resolved by following the steps below.
                </p>

                <h3 className="mt-6 text-xl font-semibold text-purple-300">
                  When Results Don't Generate or Errors Appear
                </h3>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>
                    <strong className="text-white">Check Replicate API Status:</strong> There 
                    may be temporary outages or high load on Replicate servers. Wait briefly and 
                    try again. Check the official Replicate status page for current service status.
                  </li>
                  <li>
                    <strong className="text-white">Queue Delays:</strong> With many users or 
                    complex tasks, waiting time in the Replicate API queue may increase. Even if 
                    the progress bar seems stuck, processing may be ongoing on the server, so wait 
                    3-5 minutes.
                  </li>
                  <li>
                    <strong className="text-white">Check Network Connection:</strong> Errors can 
                    occur if internet connection is unstable or firewalls/proxies block API 
                    requests. Verify other websites work normally and reconnect network if needed.
                  </li>
                  <li>
                    <strong className="text-white">Check Browser Console:</strong> Open developer 
                    tools (F12) and check the Console tab for red error messages. Copy error 
                    messages and search them to find solutions.
                  </li>
                  <li>
                    <strong className="text-white">Modify Prompt:</strong> Prompts containing 
                    prohibited words or expressions may be blocked by Replicate's content filter. 
                    Try changing prompts to more general and appropriate expressions.
                  </li>
                </ul>

                <h3 className="mt-6 text-xl font-semibold text-purple-300">
                  Issues When Using Ad Blockers
                </h3>
                <p className="leading-relaxed">
                  Using ad blocking extensions (uBlock Origin, AdBlock Plus, etc.) may cause 
                  the following issues:
                </p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>
                    Banner ads on left and right sides of pages won't display. (Doesn't affect 
                    service functionality itself)
                  </li>
                  <li>
                    "Watch Ad to Remove Watermark" button may not work, or ad scripts may not 
                    load, limiting functionality.
                  </li>
                  <li>
                    Some ad blockers block Google AdSense-related domains, which can slow page 
                    loading or break layouts.
                  </li>
                </ul>
                <p className="mt-2 leading-relaxed">
                  <strong>Solution:</strong> Please add Free AI Creation to your ad blocker's 
                  whitelist (allowlist). Most ad blockers provide features to exempt specific 
                  sites. We'd appreciate it if you could allow ads for service sustainability.
                </p>

                <h3 className="mt-6 text-xl font-semibold text-purple-300">
                  Browser and Device Compatibility
                </h3>
                <p className="leading-relaxed">
                  Free AI Creation uses modern web standards, so some features may not work 
                  properly in older browsers. Recommended environments:
                </p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>
                    <strong className="text-white">Desktop:</strong> Chrome 90+, Firefox 88+, 
                    Safari 14+, Edge 90+ (latest version recommended)
                  </li>
                  <li>
                    <strong className="text-white">Mobile:</strong> iOS Safari 14+, Android 
                    Chrome 90+ (latest version recommended)
                  </li>
                  <li>
                    <strong className="text-white">Enable JavaScript:</strong> If JavaScript is 
                    disabled in your browser, the site won't work at all. Please enable JavaScript 
                    in settings.
                  </li>
                  <li>
                    <strong className="text-white">Cookies and Local Storage:</strong> Local 
                    storage is needed to save project data. Please allow cookies and site data 
                    in browser settings.
                  </li>
                </ul>

                <h3 className="mt-6 text-xl font-semibold text-purple-300">
                  When Videos Won't Play or Downloaded Files Won't Open
                </h3>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>
                    <strong className="text-white">Video Codec Support:</strong> Generated videos 
                    use H.264 (libx264) codec and YUV420p pixel format, playable in most players 
                    and browsers. If playback fails, try universal players like VLC Media Player.
                  </li>
                  <li>
                    <strong className="text-white">Verify Download Completion:</strong> For large 
                    files, downloads may not be complete. Check file size in downloads folder and 
                    re-download if needed.
                  </li>
                  <li>
                    <strong className="text-white">Browser Cache Issues:</strong> Try clearing 
                    browser cache (Ctrl+Shift+Delete) and retry.
                  </li>
                </ul>

                <h3 className="mt-6 text-xl font-semibold text-purple-300">
                  When Local Storage Data Disappears
                </h3>
                <p className="leading-relaxed">
                  Clearing browser cache, closing incognito mode, or accessing from different 
                  devices means you can't view project data saved in local storage. Unfortunately, 
                  recovery is impossible in these cases, so we strongly recommend downloading 
                  important results immediately upon generation for separate storage. Future 
                  cloud backup features will prevent such issues.
                </p>

                <div className="mt-6 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                  <p className="text-sm text-blue-200">
                    <strong>💡 Need Additional Help?</strong> If problems persist with the above 
                    methods, capture error messages from the browser developer tools Console tab 
                    and search them, or look for similar cases in community forums. While Free AI 
                    Creation isn't an open-source project, general web technology issues can find 
                    answers in communities like Stack Overflow or Reddit.
                  </p>
                </div>
              </div>
            </section>
          </article>

          {/* Footer CTA */}
          <section className="mt-16 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-purple-800/10 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="mb-6 text-gray-300">
              Unleash your creativity in all three Free AI Creation studios. Available completely 
              free with no sign-up required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/studio/video"
                className="rounded-full bg-gradient-to-r from-purple-500 to-purple-700 px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Start AI Video
              </Link>
              <Link
                href="/studio/image"
                className="rounded-full border border-purple-500/50 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Start AI Image
              </Link>
              <Link
                href="/studio/upscale"
                className="rounded-full border border-purple-500/50 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Start Upscaling
              </Link>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
