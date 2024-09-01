// src/app/carbon-neutrality/[id]/page.tsx
"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const blogPosts = {
  '1': {
    title: 'The Path to Carbon Neutrality in Coal Mining',
    content: `
      <p>The coal mining industry faces significant challenges in the pursuit of carbon neutrality. 
      As one of the largest contributors to global carbon emissions, the sector is under increasing 
      pressure to adopt sustainable practices and reduce its environmental impact.</p>

      <h2>Understanding Carbon Neutrality</h2>
      <p>Carbon neutrality, or net-zero carbon emissions, is achieved when the amount of carbon dioxide 
      released into the atmosphere is balanced by an equivalent amount being removed. For the coal 
      mining industry, this presents a complex challenge that requires a multifaceted approach.</p>

      <h2>Strategies for Achieving Carbon Neutrality</h2>
      <p>Several strategies can be employed to move towards carbon neutrality in coal mining:</p>
      <ul>
        <li>Improving energy efficiency in mining operations</li>
        <li>Implementing carbon capture and storage technologies</li>
        <li>Transitioning to renewable energy sources for power generation</li>
        <li>Reforestation and land rehabilitation projects</li>
        <li>Investing in research and development of cleaner coal technologies</li>
      </ul>

      <p>While the path to carbon neutrality in coal mining is challenging, it is not impossible. 
      With continued innovation, investment, and commitment from industry stakeholders, significant 
      progress can be made towards a more sustainable future for coal mining.</p>
    `,
    date: 'May 15, 2023',
    author: 'John Doe',
    authorImage: '/images/john-doe.jpg',
  },
  '2': {
    title: 'Innovative Technologies for Reducing Coal Mining Emissions',
    content: `
      <p>As the world moves towards a more sustainable future, the coal mining industry is embracing innovative 
      technologies to reduce its carbon footprint. These cutting-edge solutions are not only helping to mitigate 
      environmental impact but also improving operational efficiency.</p>

      <h2>Carbon Capture and Storage (CCS)</h2>
      <p>CCS technology captures CO2 emissions from coal mining operations before they enter the atmosphere. 
      The captured CO2 is then transported and stored deep underground in geological formations. This technology 
      has the potential to significantly reduce the industry's carbon emissions.</p>

      <h2>Methane Capture and Utilization</h2>
      <p>Methane, a potent greenhouse gas, is often released during coal mining. New technologies are being 
      developed to capture this methane and use it as a clean energy source, turning a potential environmental 
      hazard into a valuable resource.</p>

      <h2>Electrification of Mining Equipment</h2>
      <p>The shift from diesel-powered to electric mining equipment is gaining momentum. Electric vehicles and 
      machinery not only reduce direct emissions but also improve air quality in underground mines.</p>

      <p>These technologies represent just a fraction of the innovative solutions being developed and implemented 
      in the coal mining industry. As research continues and technologies mature, we can expect even more 
      groundbreaking advancements in emission reduction.</p>
    `,
    date: 'June 2, 2023',
    author: 'Jane Smith',
    authorImage: '/images/jane-smith.jpg',
  },
  '3': {
    title: 'The Role of Renewable Energy in Coal Mining Operations',
    content: `
      <p>The integration of renewable energy sources into coal mining operations is becoming increasingly common 
      as the industry seeks to reduce its carbon footprint. This shift not only helps in achieving sustainability 
      goals but also often leads to cost savings in the long run.</p>

      <h2>Solar Power in Coal Mining</h2>
      <p>Many coal mining companies are installing solar panels to power their operations. These solar installations 
      can be particularly effective in remote mining locations where grid electricity is expensive or unreliable.</p>

      <h2>Wind Energy Utilization</h2>
      <p>Wind turbines are another renewable energy source being adopted by the coal mining industry. In areas with 
      favorable wind conditions, wind energy can provide a significant portion of a mine's power needs.</p>

      <h2>Hybrid Systems</h2>
      <p>Some mining operations are implementing hybrid power systems that combine renewable sources with traditional 
      power generation. These systems can provide reliable power while significantly reducing carbon emissions.</p>

      <p>The integration of renewable energy in coal mining operations is a promising step towards sustainability. 
      As renewable technologies continue to advance and become more cost-effective, we can expect to see even greater 
      adoption across the industry.</p>
    `,
    date: 'June 20, 2023',
    author: 'Michael Johnson',
    authorImage: '/images/michael-johnson.jpg',
  },
  '4': {
    title: 'Carbon Capture and Storage in Coal Mining',
    content: `
      <p>Carbon Capture and Storage (CCS) is emerging as a critical technology in the fight against climate change, 
      particularly in carbon-intensive industries like coal mining. This technology has the potential to significantly 
      reduce greenhouse gas emissions while allowing for continued use of coal resources.</p>

      <h2>How CCS Works</h2>
      <p>CCS involves capturing CO2 emissions from coal mining and processing operations, transporting this captured CO2, 
      and then storing it permanently underground in geological formations. This prevents the CO2 from entering the 
      atmosphere and contributing to global warming.</p>

      <h2>Challenges and Opportunities</h2>
      <p>While CCS technology is promising, it faces several challenges including high implementation costs and the need 
      for suitable geological storage sites. However, ongoing research and development are addressing these issues, 
      making CCS increasingly viable for widespread adoption.</p>

      <h2>Future Prospects</h2>
      <p>As CCS technology continues to evolve, it could play a crucial role in helping the coal mining industry achieve 
      its carbon neutrality goals. Combined with other sustainable practices, CCS could pave the way for a cleaner 
      future in coal mining.</p>
    `,
    date: 'July 5, 2023',
    author: 'Emily Brown',
    authorImage: '/images/emily-brown.jpg',
  },
  '5': {
    title: 'Sustainable Practices in Coal Transportation',
    content: `
      <p>The transportation of coal from mines to end-users is a significant source of carbon emissions in the coal 
      industry. Implementing sustainable practices in coal transportation is crucial for reducing the overall 
      environmental impact of coal mining operations.</p>

      <h2>Rail Transport Optimization</h2>
      <p>Rail is one of the most efficient methods of transporting coal. Many companies are optimizing their rail 
      networks, using more fuel-efficient locomotives, and implementing advanced logistics systems to reduce 
      emissions from rail transport.</p>

      <h2>Electric and Hybrid Vehicles</h2>
      <p>For shorter distances, the use of electric or hybrid vehicles for coal transportation is gaining traction. 
      These vehicles significantly reduce direct emissions compared to traditional diesel-powered trucks.</p>

      <h2>Waterway Transportation</h2>
      <p>Where possible, utilizing waterways for coal transportation can be more fuel-efficient than land-based 
      options. Many companies are investing in cleaner, more efficient barges and ships for coal transport.</p>

      <p>By focusing on sustainable transportation practices, the coal mining industry can make significant strides 
      in reducing its overall carbon footprint, contributing to broader environmental goals.</p>
    `,
    date: 'July 22, 2023',
    author: 'David Wilson',
    authorImage: '/images/david-wilson.jpg',
  },
  '6': {
    title: 'The Impact of Methane Capture in Coal Mining',
    content: `
      <p>Methane, a potent greenhouse gas, is often released during coal mining operations. Capturing and utilizing 
      this methane not only reduces greenhouse gas emissions but can also provide an additional energy source.</p>

      <h2>Methane Drainage Systems</h2>
      <p>Advanced methane drainage systems are being implemented in many coal mines. These systems capture methane 
      before it can be released into the atmosphere during mining operations.</p>

      <h2>Ventilation Air Methane (VAM) Utilization</h2>
      <p>Technologies are being developed to capture and use low-concentration methane found in mine ventilation air. 
      This methane can be converted into usable energy, further reducing emissions and providing power for mining operations.</p>

      <h2>Benefits of Methane Capture</h2>
      <p>Methane capture not only reduces greenhouse gas emissions but also improves mine safety by reducing the risk 
      of methane-related accidents. Additionally, the captured methane can be used as a clean energy source, providing 
      economic benefits to mining operations.</p>

      <p>As methane capture technologies continue to advance, they will play an increasingly important role in the 
      coal mining industry's efforts to reduce its environmental impact and move towards sustainability.</p>
    `,
    date: 'August 10, 2023',
    author: 'Sarah Thompson',
    authorImage: '/images/sarah-thompson.jpg',
  },
  '7': {
    title: 'Policy Changes Driving Carbon Neutrality in Mining',
    content: `
      <p>Government policies and regulations play a crucial role in driving the coal mining industry towards carbon 
      neutrality. Recent policy changes around the world are creating both challenges and opportunities for the sector.</p>

      <h2>Carbon Pricing Mechanisms</h2>
      <p>Many countries have implemented or are considering carbon pricing mechanisms such as carbon taxes or 
      cap-and-trade systems. These policies create financial incentives for coal mining companies to reduce their 
      carbon emissions.</p>

      <h2>Renewable Energy Mandates</h2>
      <p>Some jurisdictions are implementing renewable energy mandates that require a certain percentage of energy 
      to come from renewable sources. This is pushing coal mining companies to integrate more renewable energy into 
      their operations.</p>

      <h2>Environmental Reporting Requirements</h2>
      <p>Stricter environmental reporting requirements are being implemented in many countries. These policies 
      increase transparency and accountability, encouraging companies to take more proactive steps towards 
      reducing their carbon footprint.</p>

      <p>While these policy changes present challenges for the coal mining industry, they also create opportunities 
      for innovation and leadership in sustainability. Companies that adapt quickly to these new policy landscapes 
      will be better positioned for long-term success.</p>
    `,
    date: 'August 28, 2023',
    author: 'Robert Lee',
    authorImage: '/images/robert-lee.jpg',
  },
  '8': {
    title: 'The Future of Carbon-Neutral Coal Mining',
    content: `
      <p>As we look to the future, the concept of carbon-neutral coal mining is moving from aspiration to reality. 
      Advances in technology, changes in policy, and shifting market demands are all contributing to a transformation 
      in the coal mining industry.</p>

      <h2>Technological Advancements</h2>
      <p>Emerging technologies such as AI-driven optimization, advanced materials, and next-generation carbon capture 
      systems promise to dramatically reduce the carbon footprint of coal mining operations.</p>

      <h2>Shift to Circular Economy</h2>
      <p>The future of coal mining may involve a greater emphasis on the circular economy, with increased focus on 
      recycling and repurposing of mining waste, and the development of new products from mining by-products.</p>

      <h2>Integration with Renewable Energy</h2>
      <p>Future coal mining operations may be closely integrated with renewable energy systems, potentially even 
      serving as energy storage sites using pumped hydro or other technologies.</p>

      <h2>Workforce Transition</h2>
      <p>As the industry moves towards carbon neutrality, there will be a shift in workforce needs. Training and 
      reskilling programs will be crucial to ensure a just transition for coal mining communities.</p>

      <p>While challenges remain, the path to carbon-neutral coal mining is becoming clearer. With continued innovation, 
      investment, and commitment from all stakeholders, a sustainable future for the coal mining industry is within reach.</p>
    `,
    date: 'September 15, 2023',
    author: 'Lisa Chen',
    authorImage: '/images/lisa-chen.jpg',
  },
};

const BlogPost = () => {
  const params = useParams();
  const id = params.id as string;
  const post = blogPosts[id as keyof typeof blogPosts];

  if (!post) {
    return <div>Blog post not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
      
      <div className="flex items-center mb-8">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={post.authorImage} alt={post.author} />
          <AvatarFallback>{post.author.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{post.author}</p>
          <p className="text-sm text-gray-500">Published on {post.date}</p>
        </div>
      </div>

      <article className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

export default BlogPost;